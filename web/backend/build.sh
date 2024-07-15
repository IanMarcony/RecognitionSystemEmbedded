docker compose stop
git stash
git pull origin main --rebase
docker compose up -d --build