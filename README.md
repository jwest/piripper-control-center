# PiRipper

Automated ripping audio cd on raspberry pi

### requirements:

 - nodejs > 12.0
 - sudo apt-get install setcd
 - docker with whipper

### Install as daemon

Create service file in:

``` 
sudo nano /lib/systemd/system/piripper.service
```

with content:

```
[Unit]
Description=PiRipper daemon
After=multi-user.target

[Service]
Type=idle
User=pi
Environment="LOG_LEVEL=trace"
ExecStart=/usr/bin/node /home/pi/piripper/piripper-control-center/bin/piripper.js --config=/home/pi/piripper/piripper-control-center/config.json
Restart=always

[Install]
WantedBy=multi-user.target
```

next reload and start service:

```
sudo systemctl daemon-reload
sudo service piripper start
sudo service piripper status
```

Your logs will be on:

```
journalctl -u piripper.service -f
```