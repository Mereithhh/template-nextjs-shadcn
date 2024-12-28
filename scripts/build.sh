#!/bin/bash
tag=0.0.1
image=template-nextjs-shadcn

docker build -t ${image}:${tag} .
docker push ${image}:${tag}
