#!/bin/bash

# Clone the project
git clone https://github.com/yourname/your-nextjs-app.git
cd your-nextjs-app

# Build and start the containers
docker-compose up -d --build

# View logs
docker-compose logs -f nextjs-app