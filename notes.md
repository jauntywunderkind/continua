# notes

# Factory & Listeners

I was partial to uncompacting the Tick Listener from Factory, however now there is no interlock: multiple produce runs may run at the same time, which is not expected. I think the idea was to make _produce be interlocked on Factory, not per Listener.
