FROM python:3.8

# Install OpenJDK-8
RUN apt-get update && \
    apt-get install -y default-jre && \
    apt-get install -y ant && \
    apt-get clean;

WORKDIR /code
ADD ./requirement.txt /code
RUN pip install -r requirement.txt

ADD . /code