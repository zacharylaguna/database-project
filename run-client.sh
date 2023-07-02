# in code, can not be http://localhost:4000, must be the ip of ec2 instance http://3.17.248.106:4000 (axios related error found in browser logs)

# /usr/bin/env: ‘node’: No such file or directory
# fix by adding the nvm location to the nodepath /usr/bin/env
nodepath=$(which node); sudo ln -s $nodepath /usr/bin/node

# activate node and npm in bash
# nvm install 16.0.0

# increase linux watchers temporarily
sudo sysctl fs.inotify.max_user_watches=16384
cat /proc/sys/fs/inotify/max_user_watches

# run client
cd /home/ec2-user/real-mgmt/client
/home/ec2-user/.nvm/versions/node/v16.0.0/bin/npm start
