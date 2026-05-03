import os
import subprocess
import datetime
import sys

def run_cmd(cmd):
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error executing: {cmd}\n{e.stderr}")
        return None

def main():
    message = sys.argv[1] if len(sys.argv) > 1 else "End of Session Sync"
    date_str = datetime.datetime.now().strftime("%Y-%m-%d")
    
    print(f"🚀 Initializing Sync Protocol for {date_str}...")
    
    # 1. Update History Log
    log_path = ".agents/history/history_log.md"
    if os.path.exists(log_path):
        with open(log_path, "a") as f:
            f.write(f"\n- **{date_str}**: {message}\n")
        print("✅ History log updated.")

    # 2. Stage All Changes
    print("📦 Staging changes...")
    run_cmd("git add .")
    
    # 3. Commit
    commit_msg = f"[AUTO-SYNC] {date_str}: {message}"
    print(f"✍️ Committing: {commit_msg}")
    run_cmd(f'git commit -m "{commit_msg}"')
    
    # 4. Push
    print("📤 Pushing to GitHub...")
    push_result = run_cmd("git push origin main")
    
    if push_result is not None:
        print("✨ Sync Complete! Your work and history are safe on GitHub.")
    else:
        print("❌ Push failed. Check your internet connection or GitHub credentials.")

if __name__ == "__main__":
    main()
