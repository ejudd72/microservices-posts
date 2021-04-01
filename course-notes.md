kubernetes cluster - lots of VMS - or nodes, all controlled by a master 
kubernetes will take prigreamme and randomly assign it to be executed by a node 

Config files provide explicit directions - 'e.g. run 2 copies of posts services; 
all both copies to be accessible from network . 

Docker: 
======
Why use docker? 
ultimately - it's hard to install software 
lots of troubleshooting and going back and forward - 
- is it a bit like npm? setting up and installing dependencies

What is docker? 
===============
docker run - the cli downloads an image from the docker hub - this gets stored on your disk - it's configured to run a programme 
a container has its own space of image etc 
docker is a collection of tools/products
docker client - CLI - takes our commands and works out what to do with them 
docker servicer/daemon - the piece of software that creates and maintains containers 

Docker cheat sheet: 
===================

open docker: 
`docker ps --all` <-- shows you all machines

`docker run {machine image name}` <-- this will start a machine and run its default command

`docker run {machine image name} echo 'hi there'` <-- this will start the named machine but override its default command with 'echo ''hi there'''

`docker create {machine image name}` <-- this will create a machine but not run its default command, it will then output a machine id

`docker start {machine id}` <-- this will run the default command of the machine you've just created/the one that owns that machine id. 

`docker start {machine id} -a` <-- this wil do the above and also show you the output 

`docker ps {machine name}` <-- this will show you the machine's status and what youv'e run on it and when it was created etc

`docker system prune` <-- this will delete stopped machines off your hard disk. If you later want another one of those machine syou'll need to re-download them so creating will take a couple more seconds. 

`docker logs {machine id}` <-- you can use this if you didn't use the -a flag after using a 'docker start', it will just give you the output from what's been run on it so far 

`docker stop {container id}` <-- this will stop the machine running. sigterm signal. gives it a little bit of time to do cleanup and shut itself down/save file/emit a message

`docker kill {container id}` <-- this will kill the machine instantly. No time for cleanup/save file/emit message if necessary.

(It's better to use docker stop generally)

Redis: 
========

`docker run redis`
can't just connect to redis server, we need to execute the command inside the redis server
`docker exec -it {container id} {command}` <-- this allows us to execute a command inside the container, using the -it flag is short for -i and -t. The -i means we can type directly into the machine. Out standard 'in' in our terminal is the same as that one. the -t will format the output for us. 

`docker exec -it {machine id} sh` <-- this gives you full terminal access inside the container context. you can run lots of different commands (if ctrl + c doesn't work here to esc, you can try ctrl + d etc). The sh stands for shell (equivalent to bash or powershell or zsh).

Gotcha: two different containers do not automatically share the same file system 

Creating a docker image
=======================
create a dockerfile - config to define how our container should behave. 
making a dockerfile that creates an image that runs redis-server
create dockerfile... (see example in folder)
cd into the directory with the dockerfile in, and in terminal run `docker build .`, then copy the machine id, then do `docker run {machine id}`

'FROM' - the dockerfile to use as a base <-- bit like installing an initial operating system
Alpine is used as a base image as it has a preinstalled set of programmes useful to you

'RUN' - the command provided to the machine - `apk add --update redis` this tells apache package manager to install and update redis on this machine

'CMD' - defines the primary/default command for the machine we've just created. It doesn't execute the command. 

Rebuilds with cache
===================
IF you install a second dependency on your dockerfile with an extra RUN line (specify a new programme), when you do a `docker build . `, you don't need to go and fetch the image again, it uses a cache - docker knows that nothing has changed since last time you've run the docker build command so it doesn't run it all again, only the updated bits

Tagging an image
================
`dcoker build -t {your docker id}/{project name}:latest .`
now you can run your machine with `docker run {docker id}/{project name}`

Builing an image: 
=================
using the `COPY ./ ./   ` in dockerfile will tell the machine to copy everything from current working directory to the root of the container

Port mapping: 
==============
without this you will not be able to access the docker container from outside the machine: 
`docker run -p 8080:8080 elliejudd/simpleweb`
the -p will map the port - 
this command means - anything coming TO port 8080, redirect it to port 8080

Every time you change something in your source code, you need to re-build, and then you need to re-run 

# Kubernetes
===========
Tool for running a bunch of different containers

Docker > preferences > kubernetes > enable kubernetes

`kubectl version` to check its installed

### Terminology: 
#### Cluster 
collection of nodes plus master
#### node
virtual machine that will run our containers
#### Pod 
a pod wraps a container. For this course, it's interchangeable with container
#### Deployment 
monters a set of pods and makes sure they're running restarts them inf they crash 
#### service 
provides an easy to remember URL for other containers to access a running container/pod

### Kubernetes Config files
Always commit and store to git 
write in yaml
don't create these without config files (although it is possible)
Ignore a blog post that tells you to run direct commands to create objects

### Creating a Pod
1. rebuild your docker image:  `docker build -t elliejudd/posts:0.0.1 .`
2. make directory in root called infra, then inside that a folder called k8s. inside that, posts.yaml
3. in the file: 
```
apiVersion: v1
kind: Post
metadata: 
  name: posts
spec: 
  containers: 
  - name: posts
    image: elliejudd/posts:0.0.1
```

be careful with spacing

3. run ` kubectl apply -f posts.yaml` - if it doesn't work, check for typos in the config file 
4. check its running with `kubectl get pods`

### ErrImagePull errors: 
======================
ErrImagePull, ErrImageNeverPull and ImagePullBackoff Errors
If your pods are showing ErrImagePull, ErrImageNeverPull, or ImagePullBackOff errors after running kubectl apply, the simplest solution is to provide an imagePullPolicy to the pod.

First, run kubectl delete -f infra/k8s/

Then, update your pod manifest:

spec:
  containers:
    - name: posts
      image: cygnet/posts:0.0.1
      imagePullPolicy: Never
Then, run kubectl apply -f infra/k8s/

This will ensure that Kubernetes will use the image built locally from your image cache instead of attempting to pull from a registry.

Minikube Users:

If you are using a vm driver, you will need to tell Kubernetes to use the Docker daemon running inside of the single node cluster instead of the host.

Run the following command:

eval $(minikube docker-env)

Note - This command will need to be repeated anytime you close and restart the terminal session.

Afterward, you can build your image:

docker build -t USERNAME/REPO .

Update, your pod manifest as shown above and then run:

kubectl apply -f infra/k8s/

https://minikube.sigs.k8s.io/docs/commands/docker-env/

Understanding a pod spec: 
========================
`apiVersion:` - tells kubernetes which pool of objects we want to pull from 
`kind: ` what type of object we're creating 
`metadata    ` - different options we want to apply
`spec` the exact attribtures we want to apply to the object we're about to create
the dash' means an array 
`- name: posts ` - an array of config info, make a container with the name posts - this is the container name not the pod name 
`image` - the exact tag applied to an image. will default to the latest without the version specified of the image. It will reach to docker hub and look for it - if it's no remote on the docker hub it will error out and not find it

Common commands:
================
`docker ps` ir just like `kubectl get pods` -> prints all current container/pod information
`kubectl apply -f {path to kubernetes config yaml file}` -> will create a new pod fromt he config file
`kubectl exec -it {pod name} {command}` -> executes a given commnand inside a running pod
`kubectl logs {pod name}` -> prints out logs
`kubectl delete pod {pod name}` -> deletes given pod
`kubectl describe pod {pod name}` -> helps to debug a pod

#### To alias kubectl with K: 
Set up alias -
1. run `code C:/.bashrc`
2. inside the file add the text: `alias k="kubectl"`

or on powershell: 
1. `Function CD32 {Set-Location -Path  C:\Windows\System32}`
2. `Set-Alias -Name k -Value kubectl`

or in command prompt: 
1. `doskey k=kubectl $*` (the dollar says that arguments will be passed in there)

Dpeloyments
===========
depoloyment is a kubernetes objct that manages a/many pods
if one pod crashed the deployment should monitor it and restart it and fix it etc
You tell a deployment to use a new version of pods 
- once it's then using the new set of pods, and they're up and rnning, it will slowly delete the older ones 

Creating a deployment: 
======================
in posts-depl.yaml: 
selector and metadata work together 
selector tells to find all the pods with the label of posts
the metadata tells the exact configuration of the pods to make and manage
 run the apply commend e.g. `k apply -f post-depl.yaml`

if you delete an old pod then it'll try to repair stuff and re-create it because it's iwthin a deployment

if you delete a deployment then it will go away

If you want to update code, you will have to change the posts file, then you have to rebuild the image on docker with a new version tag, then you have to update  the kubernetes config file to use a new version of the new image. Then you will have to kubectl apply - it will reconfigure the current version rather than building a new one

Another method: 
================
remove the version from the image name in the kubernetes yaml file 
change the code 
rebuild the image (`docker build -t elliejudd/posts .`)
push the image up to the docker hub (`docker push elliejudd/posts`)
`kubectl rollout restart deployment {deployment name}`

Services: 
Nodeport - easy accessible outside the cluster - only used for dev purposes
ClusterIP - URL that's easy accessible inside the cluster
load balancer - makes a pod accessible from outside the cluster - the right way to do it

