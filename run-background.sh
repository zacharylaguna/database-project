sudo nohup bash /home/ec2-user/real-mgmt/run-client.sh > log-client.txt 2>&1 &
sudo nohup bash /home/ec2-user/real-mgmt/run-server.sh > log-server.txt 2>&1 &