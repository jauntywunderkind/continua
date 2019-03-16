> Continua

> Async Iterator that ongoingly re-runs an iterable-producing function, yielding unseen entries

# Example

This project was built to serve an SSDP implementation, which needs to listen on all network interfaces.

Node offers a `os.networkInterfaces()` call to read the list of interfaces. But which interfaces are available changes over time, and we needed a way to detect & bind to new interfaces as they become available.

`continua` neatly knits together a way to consume both the initial interfaces and ongoing updates in a unified interface:

```
for await(const netIf of continua(os.networkInterfaces)){
	// bind interface
}
```
