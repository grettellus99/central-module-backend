# UM Central Module

Un proyecto para la gestión de usuarios y permisos de los sistemas universitarios.

## Configure

Par poder correr el proyecto hace falta configurar las variables de entorno de la siguiente manera.

 1. En la raíz del proyecto crear una carpeta llamada **local-scripts**
 2. Dentro de la carpeta creada anteriormente crear un fichero llamado **development-local.sh** con el siguiente contenido

> export JWT_KEY='4xL1e0ren2SOyN1rNJpR12CCeObcy69'  
   export PORT=4015  
   export NODE_ENV='development-local'  
   export UM_API_KEY='5c828760d8a61a001c703fa9'

## Install and run

Preferentemente usar **yarn** de la siguiente manera

    yarn install && yarn dev

## Remove a enabled user(change the isEnabled property to false)

```
module.exports = {
  method: 'patch',
  path: '/:userId/devices/:deviceId',
  validate: {
    type: 'json',
    params: {
      userId: Joi.objectId(),
      deviceId: Joi.objectId(),
    },


  },
  handler: async (ctx) => {
    const { userId, deviceId } = ctx.request.params;

    const user = await User.findById(userId);

    const editDevice = user.devices.find(d => d.id === deviceId);
    editDevice.isEnabled = false;

    await user.save();

    ctx.status = 200;
    ctx.body = user;
  },
};
```
## Add a device to an user

```
module.exports = {
  method: 'post',
  path: '/:userId/device',
  validate: {
    type: 'json',
    params: {
      userId: Joi.objectId(),
    },
    body: Joi.object().keys({
      name: Joi.string().required(),
      deviceType: Joi.number().valid(Object.values(devicesTypes)).required(),
      mac: Joi.string().required(),
      modifiedDate: Joi.date().required(),
      isEnabled: Joi.boolean(),
    }),
  },
  handler: async (ctx) => {
    const { userId } = ctx.request.params;
    const device = ctx.request.body;

    const user = await User.findById(userId);

    ctx.assert(user, 404, 'User not found');

    const enabledDev = user.devices.filter(d => d.isEnabled);

    ctx.assert(enabledDev.length < USER_DEVICES_MAX, 400, 'Max number of enabled devices reached');

    user.devices.push(device);

    await user.save();

    ctx.status = 200;
    ctx.body = user;
  },
};
```

## add entitlements
```
module.exports = {
  method: 'post',
  path: '/:userId/entitlements',
  validate: {
    type: 'json',
    params: {
      userId: Joi.objectId(),
    },
    body: {
      entitlementsIds: Joi.array().items(Joi.objectId()).required(),
    },
  },
```

## add roles
```
module.exports = {
  method: 'post',
  path: '/:userId/add-role/:roleId',
  validate: {
    type: 'json',
    params: {
      roleId: Joi.objectId(),
      userId: Joi.objectId(),
    },

  },
```
