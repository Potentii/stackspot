# Stackspot

[![NPM Version][npm-image]][npm-url]


[Stackspot](https://stackspot.com/) API bindings for NodeJS.

<br>

---


# Content

<!-- TOC -->
- [Installation](#installation)
- [Usage](#usage)
  - [⚙️ Configuration](#-configuration)
  - [🛜 Using behind proxy](#-using-behind-proxy)
- [Methods](#methods)
  - [✨ AI](#-ai)
    - [AI - Create a new Knowledge Source](#ai---create-a-new-knowledge-source)
    - [AI - Upload new file to a Knowledge Source](#ai---upload-new-file-to-a-knowledge-source)
    - [AI - Remove files from a Knowledge Source](#ai---remove-files-from-a-knowledge-source)
  - [🗝️ Auth](#-auth)
    - [Auth - Get the access token](#auth---get-the-access-token)
- [License](#license)
<!-- TOC -->




<br>
<br>

---

## Installation

To install, simply add the package using `npm`, `yarn`, `pnpm`, etc...

```bash
npm install stackspot
```



<br>
<br>

---

## Usage

You can start using the **global instance**:

```javascript
import { Stackspot } from 'stackspot';

// By default, the global instance will configure itself using the environment variables:
// - STACKSPOT_CLIENT_ID
// - STACKSPOT_CLIENT_SECRET
// - STACKSPOT_REALM

// Creating a new 'Knowledge Source' for example:
await Stackspot.instance.ai.ks.createKs('new-ks-test-api-2', 'New KS test', 'This is a test KS', 'CUSTOM');
```

---

### ⚙️ Configuration

You can **configure** the global instance:

```javascript
// Using the 'config(opts)' method, to update the all the settings at once:
Stackspot.instance.config({
	clientId: '...',
	clientSecret: '...',
	realm: '...',
	agent: myHttpAgent
});



// Or update them individually:
Stackspot.instance
	.setClientId('...')
	.setClientSecret('...');
```

If you want to create your own **Stackspot instance**, you can either pass the settings on the **constructor**, use the 'config' method, or configure individual properties as well:

```javascript
// Creating a new stackspot instance (instead of using the 'global' one):
const myInstance = new Stackspot({ clientId: '...', clientSecret: '...', realm: '...' });


// If you want, it's possible to call the 'config(opts)' method of this instance as well to update the settings:
myInstance.config({ ... });


// Or configure properties individually:
myInstance.setClientId('...');
```

---

### 🛜 Using behind proxy

Internally it uses [`node-fetch`](https://github.com/node-fetch/node-fetch) to make requests, so you can provide a **custom HTTP agent** to configure **proxy** and **SSL certificates**.

Example using [`proxy-agent`](https://www.npmjs.com/package/proxy-agent):

```javascript
import { Stackspot } from 'stackspot';
import { ProxyAgent } from 'proxy-agent';

// ProxyAgent will use environment variables to configure proxy like HTTP_PROXY, HTTPS_PROXY and NO_PROXY.
Stackspot.instance.setAgent(new ProxyAgent());
```

<br>
<br>

---

## Methods

Here are all the available methods of this package:

<br>

### ✨ AI

All the **AI** related functions are bellow `Stackspot.instance.ai` namespace.


<br>

#### AI - Create a new Knowledge Source

To **create** a new _Knowledge Source_, just run:

```javascript
await Stackspot.instance.ai.ks.createKs('my-new-ks', 'My new KS', 'A test KS', 'CUSTOM');
```

For more info about the **KS creation**, check out the official documentation: https://ai.stackspot.com/docs/knowledge-source/create-knowledge-source


<br>

#### AI - Upload new file to a Knowledge Source

You can **add** or **update** existing objects inside a _Knowledge Source_:


```javascript
// This creates/updates a KS object named 'test.txt' containing 'Hello World' text:
await Stackspot.instance.ai.ks.uploadKsObject('my-ks-slug', 'test.txt', 'Hello World');
```

```javascript
// Assuming you have a file in ./my-file.txt:
const fileContent = await fs.promises.readFile('./my-file.txt', 'utf8');

await Stackspot.instance.ai.ks.uploadKsObject('my-ks-slug', 'test.txt', fileContent);
```

<br>

#### AI - Remove files from a Knowledge Source

To **batch remove** files from a _Knowledge Source_:

```javascript
// This removes ALL objects from the KS:
await Stackspot.instance.ai.ks.batchRemoveKsObjects('my-ks-slug', 'ALL');
```

```javascript
// This removes only the STANDALONE objects from the KS:
await Stackspot.instance.ai.ks.batchRemoveKsObjects('my-ks-slug', 'STANDALONE');
```

```javascript
// This removes only the UPLOADED objects from the KS:
await Stackspot.instance.ai.ks.batchRemoveKsObjects('my-ks-slug', 'UPLOADED');
```

<br>

---

### 🗝️ Auth

The library methods **already** handles the **authentication process**, but you can access the auth methods by yourself using the `Stackspot.instance.auth` namespace:

<br>

#### Auth - Get the access token

This will get the **cached token**, or **fetch a new one** if they aren't valid anymore:

```javascript
await Stackspot.instance.auth.getAccessToken();
```

_**Obs.:** To configure the authentication properties like `clientId`, `clientSecret`, and `realm`, head back to the [Usage section](#usage)._


<br>
<br>

---

## License
[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/stackspot.svg
[npm-url]: https://npmjs.org/package/stackspot
