FROM python:latest

# Install system dependencies
RUN apt-get update && apt-get install -y \
    sqlite3 \
    curl \
    gnupg \
    git \
    bash-completion \
    build-essential \
    ca-certificates \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js version 23 and npm, then Angular CLI then nextjs and reactjs
RUN curl -fsSL https://deb.nodesource.com/setup_23.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g @angular/cli && \
    npm install -g create-next-app && \
    npm install -g create-react-app

    
# Install Starship prompt
RUN curl -fsSL https://starship.rs/install.sh | sh -s -- -y && \
    echo 'eval "$(starship init bash)"' >> ~/.bashrc


# Configure starship.toml
RUN mkdir -p ~/.config && \
    starship preset tokyo-night > ~/.config/starship.toml
