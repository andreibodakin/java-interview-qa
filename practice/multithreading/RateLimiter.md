
## Условие

🧩 Задача: Rate Limiter (ограничение частоты запросов)

Реализуй класс RateLimiter, который ограничивает количество вызовов метода tryAcquire() до N раз в T секунд.

Метод tryAcquire() должен возвращать true, если запрос разрешён, и false — если лимит исчерпан.
Лимит сбрасывается каждые T секунд («слайдинг window» не требуется — достаточно фиксированного окна).
Реализация должна быть потокобезопасной.
Нельзя использовать java.util.concurrent (только synchronized, wait, notify, примитивы и стандартные коллекции).

Пример использования
```java
RateLimiter limiter = new RateLimiter(3, 10); // 3 запроса в 10 секунд

System.out.println(limiter.tryAcquire()); // true
        System.out.println(limiter.tryAcquire()); // true
        System.out.println(limiter.tryAcquire()); // true
        System.out.println(limiter.tryAcquire()); // false
        Thread.sleep(10_000);
System.out.println(limiter.tryAcquire()); // true
```

## Решение

```java
import java.util.concurrent.TimeUnit;

public class RateLimiter {
    private final int maxRequests;
    private final long windowMillis;
    private int currentRequests;
    private long windowStartMillis;

    public RateLimiter(int maxRequests, int windowSeconds) {
        this.maxRequests = maxRequests;
        this.windowMillis = TimeUnit.SECONDS.toMillis(windowSeconds);
        this.currentRequests = 0;
        this.windowStartMillis = System.currentTimeMillis();
    }

    public synchronized boolean tryAcquire() {
        long now = System.currentTimeMillis();

        if (now - windowStartMillis >= windowMillis) {
            windowStartMillis = now;
            currentRequests = 0;
        }

        if (currentRequests < maxRequests) {
            currentRequests++;
            return true;
        }

        return false;
    }
}
```
