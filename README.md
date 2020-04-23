# IoT-Application-using-MEAN-Stack
IoT application built using the MEAN stack for controlling appliances connected to Node MCU.

## Version
1.0.0

## This repo contains the code for a Socket-MQTT Appliance Management App built using the MEAN stack:

* MongoDB
* ExpressJS
* Angular
* NodeJS

## Schematic flow diagram demonstrating the working of the application:
![](images/schematic_flowchart.jpg) 

## Circuit diagram:
![](images/circuit.png) 

## Appliances Page, here you can control the LED's connected to the Node MCU:
![](images/appliances.png) 

## Sign In page of the application:
![](images/sign_in.png) 

## Registration Page of the application:
![](images/register.png) 

## Instructions

1. Run this command in the main directory, as well as in the "angular-src" directory for installing the necessary node modules:

```
npm install
```

2. Add your broker service credentials in "app.js" and "nodemcu_sketch" files.

3. Upload "nodemcu_sketch" on your Node MCU.

4. Make sure MongoDB is running by running this command:

```
mongod
```

5. Run the Node server using this command:

```
node app.js
```

6. Start the angular server using this command:

```
ng serve
```

## Enjoy!!
