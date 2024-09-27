run:
	go run cmd/server/main.go

build:
	docker rmi ghcr.io/fajarlubis/xchat-client:latest || true && docker build --platform linux/amd64 -t ghcr.io/fajarlubis/xchat-client:latest .

push: build
	docker push ghcr.io/fajarlubis/xchat-client:latest	
	scp -r static root@172.104.57.47:/var/docker/xchat-client	
	scp -r templates root@172.104.57.47:/var/docker/xchat-client	

.PHONY: run build