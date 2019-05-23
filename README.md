# async-iter-unique

> Pass-through async iterators while filtering out duplicate items

Has three different strategies for de-duplicationg:
* **value.js:** do a deep-equals compare versus existing objects, dropping any seen objects. this requires walking seen objects looking for a match.
* **reference.js:** use WeakSet to keep track of currently seen items. does no deep-equal checking: objects dropped only if we've seen that exact object. performance is per WeakSet.
* **id.js:** sythesize an id for each item. if another item comes in with the same id, pass it through only if it is not deep-equal. this id lets us find a specific item to compare against quickly.
