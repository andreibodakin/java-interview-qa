
## Условие

Требования задачи:
Реализовать BlockingQueue с двумя методами: 

put(item) — блокируется, если очередь полная
take() — блокируется, если очередь пустая
→ Твоя реализация должна использовать только:

synchronized
wait()
notify() / notifyAll()
Примитивы и коллекции из java.util (например, LinkedList), но не из java.util.concurrent

## Решение

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class SimpleBlockingQueue<T> {
    private final Queue<T> queue;
    private final int capacity;

    public SimpleBlockingQueue(int capacity) {
        this.queue = new ArrayDeque<>(); // можно использовать LinkedList если нужно хранить null значения
        this.capacity = capacity;
     }

    public synchronized void put(T item) throws InterruptedException {
        while (queue.size() == capacity) {
            wait();
        }
        queue.add(item);
        notifyAll();
    }

    public synchronized T take() throws InterruptedException {
        while (queue.isEmpty()) {
            wait();
        }
        T item = queue.poll();
        notifyAll();
        return item;
    }
}
```
