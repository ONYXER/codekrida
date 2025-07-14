FROM ubuntu:22.04

ARG DEBIAN_FRONTEND=noninteractive

# Install required tools
RUN apt-get update && apt-get install -y \
    sudo \
    bash \
    curl \
    wget \
    git \
    vim \
    nano \
    build-essential \
    gcc \
    g++ \
    python3 \
    python3-pip \
    openjdk-17-jdk \
    nodejs \
    npm \
    unzip \
    zip \
    iputils-ping \
    net-tools \
    && apt-get clean

# Create non-root user 'devuser'
RUN useradd -m -s /bin/bash devuser && echo "devuser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Create workspace directory inside the user home
RUN mkdir -p /home/devuser/workspace && chown -R devuser:devuser /home/devuser/workspace

# Set working directory
WORKDIR /home/devuser/workspace

# Switch to non-root user
USER devuser

# Set bash prompt to make sure it looks like Ubuntu-style prompt
ENV PS1="\[\e[1;32m\]\u@ubuntu:/workspace$\[\e[0m\] "

# Restrict shell navigation using .bashrc
RUN echo '\n\
# Lock to /home/devuser/workspace\n\
cd /home/devuser/workspace\n\
function cd() {\n\
  builtin cd "$@"\n\
  if [[ "$PWD" != /home/devuser/workspace* ]]; then\n\
    echo "Access denied: You cannot leave /home/devuser/workspace"\n\
    builtin cd /home/devuser/workspace\n\
  fi\n\
}\n' >> /home/devuser/.bashrc

CMD ["/bin/bash"]