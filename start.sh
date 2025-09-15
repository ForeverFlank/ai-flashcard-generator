#!/bin/bash

SESSION="dev-session"
IP="localhost"
CONFIG_FILE="/frontend/config.js"

tmux new-session -d -s $SESSION

tmux send-keys -t $SESSION "cd frontend" C-m
tmux send-keys -t $SESSION "echo -e 'export const BACKEND_URL = \"http://$IP:3222\";' > ./public/scripts/config.js" C-m
tmux send-keys -t $SESSION "echo -e 'export const FRONTEND_URL = \"http://$IP:3221\";' >> ./public/scripts/config.js" C-m
tmux send-keys -t $SESSION "npm start" C-m

tmux split-window -h -t $SESSION
tmux send-keys -t $SESSION "cd backend" C-m
tmux send-keys -t $SESSION "npm start" C-m

tmux attach -t $SESSION