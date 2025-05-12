# File Storage Adapter

A file-based storage adapter for [storj-lib](https://github.com/internxt/core), built for demonstration purposes.

This adapter implements a simple interface for storing data shards directly on the file system. Each shard is saved as a standalone file, with the shard's hash as the filename and the file's contents being the shard data itself.

> [!CAUTION]
> This implementation is not production-ready. It is intended for learning and experimentation.

## Requirements

- Node.js v10.x.x
- Yarn
- Python 2.x (needed by some older dependencies)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/marcmarine/storage-adapter.git
cd storage-adapter
yarn --ignore-engines
```

## Testing

Run the test suite:

```bash
yarn test
```

## Usage

```js
const storj = require('storj-lib')
const FileStorageAdapter = require('storage-adapter')

const adapter = new FileStorageAdapter('/path/to/storage')
const manager = new storj.StorageManager(adapter)

// ...
```
