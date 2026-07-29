import os
import ssl
from ftplib import FTP_TLS
import sys
import time

# Ensure UTF-8 output
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

def load_env():
    env = {}
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if not os.path.exists(env_path):
        print("Error: .env file not found.")
        sys.exit(1)
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    return env

def get_ftp_connection(host, port, user, password, remote_dir):
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    ftps = FTP_TLS(context=context)
    ftps.connect(host, port, timeout=30)
    ftps.login(user, password)
    ftps.prot_p()
    ftps.cwd(remote_dir)
    return ftps

# Cache of remote directory listings
remote_dir_cache = {}

def get_remote_file_size(ftps, remote_dir_path, filename):
    remote_dir_path = remote_dir_path.replace("\\", "/").rstrip("/")
    if not remote_dir_path:
        remote_dir_path = "/"
        
    if remote_dir_path not in remote_dir_cache:
        dir_sizes = {}
        try:
            orig_dir = ftps.pwd()
            ftps.cwd(remote_dir_path)
            # Use mlsd to list files
            for name, facts in ftps.mlsd():
                if facts.get("type") == "file":
                    try:
                        dir_sizes[name] = int(facts.get("size", -1))
                    except ValueError:
                        pass
            ftps.cwd(orig_dir)
        except:
            # Keep cache empty if directory does not exist yet
            pass
        remote_dir_cache[remote_dir_path] = dir_sizes
        
    return remote_dir_cache[remote_dir_path].get(filename, -1)

def should_upload_file(ftps, remote_dir_path, filename, local_file_path):
    remote_size = get_remote_file_size(ftps, remote_dir_path, filename)
    if remote_size != -1:
        local_size = os.path.getsize(local_file_path)
        if remote_size == local_size:
            return False
    return True

def clear_cache_for_dir(remote_dir_path):
    remote_dir_path = remote_dir_path.replace("\\", "/").rstrip("/")
    if not remote_dir_path:
        remote_dir_path = "/"
    if remote_dir_path in remote_dir_cache:
        del remote_dir_cache[remote_dir_path]

def main():
    env = load_env()
    host = env.get("PROD_FTP_HOST")
    user = env.get("PROD_FTP_USER")
    password = env.get("PROD_FTP_PASSWORD")
    port = int(env.get("PROD_FTP_PORT", "21"))
    remote_dir = env.get("PROD_FTP_REMOTE_DIR", "/public_html")

    if not host or not user or not password or password == "ENTER_YOUR_FTP_PASSWORD_HERE":
        print("Error: Please set PROD_FTP_PASSWORD in the .env file.")
        sys.exit(1)

    if host.startswith("ftp://"):
        host = host[6:]
    elif host.startswith("ftps://"):
        host = host[7:]

    local_dir = os.path.join(os.path.dirname(__file__), "ttvina_production")
    if not os.path.exists(local_dir):
        print(f"Error: Local directory {local_dir} not found. Run 'python copy_and_replace.py production' first.")
        sys.exit(1)

    print(f"Connecting to FTP TLS Server {host}:{port}...")
    try:
        ftps = get_ftp_connection(host, port, user, password, remote_dir)
        print("Successfully connected and authenticated via FTPS!")
    except Exception as e:
        print(f"Initial connection failed: {e}")
        sys.exit(1)

    # Specific files list to deploy
    allowed_files = [
        "products/phu-kien-robot-va-tu-dong-hoa.html",
        "assets/css/main.css",
        "assets/js/3d-viewer.js",
        "assets/js/i18n.js",
        "assets/js/main.js",
        "assets/3d/aur/r-tec-liner-550mm.stl",
        "assets/3d/aur/R-Tec Box EW 48 MP - 100N_83692654.stl"
    ]

    print(f"Starting deploy of ONLY 3D Viewer files ({len(allowed_files)} files) from {local_dir} to remote {remote_dir}...")
    
    total_files = 0
    skipped_files = 0
    uploaded_files = 0
    failed_files = 0

    for rel_path in allowed_files:
        total_files += 1
        local_path = os.path.join(local_dir, rel_path.replace("/", os.sep))
        if not os.path.exists(local_path):
            print(f"Warning: Local file {local_path} not found. Skipping.")
            failed_files += 1
            continue
            
        file = os.path.basename(local_path)
        remote_path = rel_path.replace(os.sep, "/")
        remote_parent = os.path.dirname(remote_path)

        retries = 3
        success = False
        
        # Calculate the target remote directory path
        target_remote_dir = remote_dir
        if remote_parent:
            target_remote_dir = f"{remote_dir}/{remote_parent}".replace("//", "/")

        while not success and retries > 0:
            try:
                # Keep connection alive
                try:
                    ftps.voidcmd("NOOP")
                except:
                    print("Connection lost. Reconnecting to FTPS...")
                    ftps = get_ftp_connection(host, port, user, password, remote_dir)
                    remote_dir_cache.clear()

                # Ensure remote directory path exists
                if remote_parent:
                    parts = remote_parent.split("/")
                    current = remote_dir
                    for part in parts:
                        if not part:
                            continue
                        current = f"{current}/{part}"
                        try:
                            ftps.cwd(current)
                        except:
                            try:
                                ftps.mkd(current)
                                print(f"Created remote directory: {current}")
                                clear_cache_for_dir(os.path.dirname(current))
                            except:
                                pass
                    ftps.cwd(remote_dir)

                dest_file = f"{remote_dir}/{remote_path}"
                
                # Verify if upload is needed using directory cache
                if not should_upload_file(ftps, target_remote_dir, file, local_path):
                    skipped_files += 1
                    success = True
                    break

                # Perform file transfer
                print(f"Uploading: {rel_path} -> {dest_file}")
                with open(local_path, "rb") as f:
                    ftps.storbinary(f"STOR {dest_file}", f)
                
                clear_cache_for_dir(target_remote_dir)
                uploaded_files += 1
                success = True
            except Exception as e:
                print(f"Error transferring {rel_path}: {e}. Retrying in 2s...")
                retries -= 1
                try:
                    ftps.quit()
                except:
                    pass
                remote_dir_cache.clear()
                time.sleep(2)

        if not success:
            print(f"Failed to upload file after retries: {rel_path}")
            failed_files += 1

    try:
        ftps.quit()
    except:
        pass
        
    print(f"\nDeployment completed!")
    print(f"Total: {total_files}, Uploaded: {uploaded_files}, Skipped: {skipped_files}, Failed: {failed_files}")

if __name__ == "__main__":
    main()
