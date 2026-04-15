# Pihole - Free ur home wifi
I recently installed pihole on my parents home wifi. Here are some thoughts and ideas on how to do it. I was motivated by ct3003 ( Kenos video).

## What is it?
First lets think about what it is and does. It impersonates the DNS server for your Router. 
Its like a little man that stands in front of your porch looks at envelopes and throws them and doesnt accept them if they are from googleadservices.com and other annoying domains. 

This is why it can only block static ads tutorial and blog websites but not youtube ads. 
For youtube ads you need a little man that *opens the envelope* looks inside and decides this video is an advertisement clip. 

In general this makes web pages nice as they used to be and also speeds up loading time. 
At our home it claims to block 10 - 30% of the requests so this must have a performance impact, as all those requests need not be processed.

### Why pihole + adblock instead of only uBlock Origin addon?

I guess the main feature is its good for non-techies as everyone benefits + it removes ads on ebooks and other smart devices 
However it doesnt remove youtube ads :/ For that Revanced Youtube might be interesting if you want an app instead of brave)
I think it might be a more clean way as you cannot even resolve the Domain of an ad if you want to.


### Possible disadvantages of pihole
*  dependency of your wifi of the pi -> you can make a detailed one or two page instruction on how to revert those 3 router configurations that you need to do to effectively change back the DNS server from pi to the default one in case the pi dies (but even if you know how to restore default settings theoretically it still is more likely to break than your default DNS server, yes)
*  some (very few ads are actually useful for some peeople. My Schwägerin mentioned she cannot click on previews of amazon products presented in the google search anymore but has to go to amazon page.

# What did I do (in a nutshell)
1. take old laptop and put debian on it
2. setup openssh-server and configure the /etc/ssh/sshd_config file such that
   * root login disallowed
   * password login disallowed
   * change default ssh port
3. install docker from their official setup instructions for debian
4. looked up pihole docker compose yaml
5. adapted to my needs
6. started the docker compose yaml with docker compose up
7. wrote some docs to how to restore the old settings and DNS Server and printed them

---
# What i did in Detail

## Installing Debian + old Notebook = Server

**Heimnetz appearance des servers** probably some useless thing but i settled to name the laptop like so even if i dont have this domain  
myserver.intranet-myfamily.org

* Name des non root user for everyday tasks  
  * essentially setup three users: root, me, a guestish user to use laptop offline

* Partitionierung
4 Partitionen  
* chose an extra Ext4 home partition gewählt um sauberer zu trennen

* openssh installation notwendig https://linuxcapable.com/how-to-install-ssh-and-enable-on-debian/ gelesen

maybe read and try [this tutorial](https://techyorker.com/how-to-set-up-wifi-in-debian-with-the-command-line/) to get wifi adapter working if you used LAN at installation or skip to next chapter for the solution

# Server needs to join home Wifi
tried nmcli tried wpa_supplicant tried so much stuff 
> **FINAL SOLUTION** : just use `nmtui` which is a terminal gui network manager interface it is so much easier.

# Install a desktop environment (DE)

I went with 
> xcfe

as its nice and lean. Works outof the box with one command installable :)

# SSH access

it works. we need `openssh` on the server and [this tutorial](https://linuxcapable.com/how-to-install-ssh-and-enable-on-debian/) really helps with installing it and setting up pubkey auth etc there and walk you through it.  
A central thing is the `/etc/ssh/sshd_config` which defines the ways of ssh access of the server and lies on the server

I locked myself out at some point. Strange as my pubkey is in authorized keys...  
Solution in the sshd_config file we comment out the AuthorizedKeysFile (and set the desired path in `~/.ssh/authorized_keys` )

after this file is changed we allways need to reboot ssh with:  
`# systemctl restart ssh`

Adding the ssh connected user to sudoers group ist in sofern gut glaub ich weil der root user nicht der sein soll mit dem man ssh connecten kann aber man will ja auch wat mit admin rechten schaffen..:  
[here some tutorial i read](https://linuxcapable.com/how-to-add-a-user-to-sudoers-on-debian/)

- assume your name is josh and you cannot decide if you are alive..
- so after apt update we install `sudo` program and then we  
    `sudo usermod -aG sudo josh`  
    while the opposite would be  
    `sudo deluser josh sudo`

Now we had some problems of the  
ssh access not permitted (publickey) type:  
Typical problems like these are caused by fecking up the folder permissions on the server or even the client (i dare to say a frequent developer probably has them set up correctly on the client already so worry about the server instead)

- the `/home/MYUSERNAME/.ssh` should have permission 700  
    and the contained `authorized_keys` file needs permission 600
- however what solved it for me was looking into our `/etc/ssh/sshd_config` file which we know and love and double check the reference to where the authorized keys file is searched. I changed it from `~/.ssh/authorized_keys` to `/home/MYUSERNAME/.ssh/authorized_keys` and the explicitness cured my ssh connection :)

# Docker

First i want to install docker if possible. i will followed this [official tutorial](https://docs.docker.com/engine/install/debian/)  
I also added my user to the docker group  
On Debian and Ubuntu, the Docker service starts on boot by default btw.  
I need to care about dockers logging drivers and set up log rotation in  
`/etc/docker/daemon.json` like described [here by docker docs](https://docs.docker.com/engine/logging/drivers/json-file/).  
its done. i think it should work dunno how to test tho

# pihole

Maybe i should not put my ssh private key on the server but i want to store the config in my repo so here is what to do:
i installed an ssh `deploykey` on the server that has read + write access **only** to my open source pihole repo  
the repo works as i added this to the ~/.ssh/config of the server:

```
Host codeberg.org
    HostName codeberg.org
    IdentityFile ~/.ssh/id_homeserver_deploykey
    Port 22
```

- `docker compose up` in the home-pihole folder **launches pihole DNS server** and now makes the pihole dashboard accessible on the ip address of my server.  
    We can log in using the pihole password specified in the `.env` file of our own pihole repo
- we would like to access it from the hobbit domain s.t. hobbits now where to find the wirkaufennichts project so i set up a dns entry in mydomain.de s.t.  
    `<PIHOLESUBDOMAIN>.mydomain.de` points to the ip address of server

the domain doesnt work yet but then again i dont use a reverse proxy yet maybe thats a problem as i neither use anything that enables true https and fetches a ssl cert for the dashboard  
at least not knowingly. maybe pihole does so but in any case it need nginx to become secure. Lets roll!!

TODO

- [x] A static IP address or DHCP reservation for your server (critical , your entire network depends on this IP for DNS)

# router stuff

I can access the router UI at this ip http://192.168.178.1/  
that is http://YYY.YYY.YYY.1 for if the server has the IP http://YYY.YYY.YYY.XXX  
here we can do maintenance lets see what we can do at a fritzbox interface..

**Intermezzo :** Btw i think the dynamic IP rotation is called **DHCP** afaik

Now lets see .. we can login into fritzbox only with another password that is not equal to the wifi access password! ask your wifi maintainer or inspect the routers case to find it :)

## changing the DNS server on a Fritzbox

watch the video of keno he shows it.
but to which value ?? lets see first tomorrow

# SOON -> Migrate to iptables firewall ?

Since ssh seems to work lets move on..

> Make sure that any firewall rulesets you use are created with iptables or ip6tables, and that you add them to the DOCKER-USER chain

acc. to docker docs. Also they basically say tho that active fiddling with iptables is not encouraged [(see here)](https://docs.docker.com/engine/network/packet-filtering-firewalls/)  
Therefore we just need a way to see which ports are open on the server using iptables.  
[This webiste](https://www.cyberciti.biz/faq/how-to-list-all-iptables-rules-in-linux/) looks good and tells us sth about it.

```
# iptables -S 

```

seems to print all ipv4 rules and ip6tables is used for the others. The fact that ip tables exists is enough for me. I dont want to modify it just be able to inspect which ports are open

- [x] decided not remove ufw. i think it doesnt do much harm to keep it (future georg was happy)
- [x] setup my allow 22/tcp in iptables. while doing so change ssh port to 2222 for security inside of sshd_config.  
    \--  
    as ufw still works i could just allow 2222/tcp via ufw and then this is applied to iptables by ufw.  
    however once docker uses 2222 docker has vorrang
- [x] then make sure the correct port 2222 is open on the server and others not  
    \--  
    i checked it on iptables

i think this is fine and done.

# router

## set server ip to static

In router settings "Heimnetz" select "Netzwerk" then select the pihole server.
Then check the little check box to assign to the server a static IP.

## set up router to listen to pihole

- go to http://192.168.178.1/#netSet
- scroll down completely
- there are two buttons one to change IPv4 and one to change IPv6 settings
### changes
* update "Lokaler DNS Server" to `pihole-server-IPv4-address`
* in IPv6 settings update the IPv6 address under `DNSv6-Server im Heimnetz`
* in IPv6 or v4 settings (dont remember) change `Nur DNS Server zuweisen` to `DNS Server Präfix und IPv6 addresse zuweisen`

---
Thanks for reading my log :) 
Add your FAQ below if you need help and write me @geoeee:matrix.fenker.eu
