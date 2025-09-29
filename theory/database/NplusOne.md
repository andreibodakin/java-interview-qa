## Вопрос: Проблема N+1

**Проблема N+1** — это распространённая **анти-паттерн производительности** при работе с базами данных и ORM (например, Hibernate в Java), когда для получения связанных данных выполняется **1 запрос для основной сущности + N запросов для каждой связанной записи**, вместо одного оптимизированного запроса.

---

## 📌 Пример на Java + Hibernate

Допустим, у тебя есть сущности:

```java
@Entity
public class Author {
    @Id
    private Long id;
    private String name;

    @OneToMany(mappedBy = "author")
    private List<Book> books; // lazy loading по умолчанию
}

@Entity
public class Book {
    @Id
    private Long id;
    private String title;

    @ManyToOne
    private Author author;
}
```

Ты хочешь вывести всех авторов и их книги:

```java
List<Author> authors = authorRepository.findAll(); // 1 запрос: SELECT * FROM author

for (Author author : authors) {
    System.out.println(author.getName());
    for (Book book : author.getBooks()) { // ← при первом обращении к books — делается SELECT из book
        System.out.println("  - " + book.getTitle());
    }
}
```

### ❌ Что происходит:
- 1 запрос — получить всех авторов (`SELECT * FROM author`)
- N запросов — по одному на каждого автора:  
  `SELECT * FROM book WHERE author_id = ?`

Если авторов 100 → **101 запрос к БД** → медленно, особенно при высокой задержке сети.

---

## ✅ Как исправить?

### 1. **Жадная загрузка (JOIN FETCH)**

```java
@Query("SELECT a FROM Author a LEFT JOIN FETCH a.books")
List<Author> findAllWithBooks();
```

→ Выполнится **один запрос с JOIN**:
```sql
SELECT a.*, b.* 
FROM author a 
LEFT JOIN book b ON a.id = b.author_id
```

### 2. **Пакетная загрузка (Batch Fetching)**

В `application.properties`:
```properties
spring.jpa.properties.hibernate.default_batch_fetch_size=10
```

→ Hibernate сгруппирует запросы: вместо 100 отдельных — сделает 10 пакетов по 10 ID.

### 3. **Явный запрос с IN**

```java
List<Long> authorIds = authors.stream().map(Author::getId).collect(Collectors.toList());
List<Book> books = bookRepository.findByAuthorIdIn(authorIds); // один запрос
```

→ Затем вручную сгруппировать книги по авторам.

---

## 💡 Почему это важно?

- **N+1 убивает производительность** даже на небольших данных.
- Проблема **не видна на локальной БД** (низкая задержка), но **катастрофична в продакшене**.
- ORM (Hibernate) по умолчанию использует **ленивую загрузку (lazy loading)** → легко случайно вызвать N+1.

---

## ✅ Как обнаружить?

- Включить лог SQL:  
  ```properties
  spring.jpa.show-sql=true
  logging.level.org.hibernate.SQL=DEBUG
  ```
- Использовать инструменты: **Hibernate Statistics**, **datasource-proxy**, **JPA Buddy**, **Micrometer**.

---

## 📌 Вывод:

> **Проблема N+1** — это когда вместо одного эффективного запроса к БД выполняется **1 + N мелких запросов**, что приводит к резкому падению производительности.  
> Решается через **жадную загрузку**, **пакетирование** или **ручную оптимизацию запросов**.
