## Условие Разворот бинарного дерева (Invert Binary Tree)

Дано бинарное дерево. Напишите метод, который **инвертирует его зеркально**: для каждого узла поменяйте местами его левое и правое поддеревья.

**Определение узла дерева:**

```java
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
```

### 🧪 Пример:

**До:**
```
     4
   /   \
  2     7
 / \   / \
1   3 6   9
```

**После:**
```
     4
   /   \
  7     2
 / \   / \
9   6 3   1
```

### 📌 Требования:
- Реализуйте метод:  
  ```java
  public TreeNode invertTree(TreeNode root)
  ```

### 💡 Подсказка:
> Эта задача стала вирусной после твита Max Howell:  
> *Google: 90% of our engineers use the software you wrote (Homebrew), but you can’t invert a binary tree on a whiteboard so fuck off.*


## Решение

```java
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Solution {
    public TreeNode invertTree(TreeNode root) {
        // Базовый случай: если узел пустой — возвращаем null
        if (root == null) {
            return null;
        }

        // Рекурсивно инвертируем левое и правое поддеревья
        TreeNode left = invertTree(root.left);
        TreeNode right = invertTree(root.right);

        // Меняем местами левое и правое поддеревья
        root.left = right;
        root.right = left;

        // Возвращаем текущий узел (уже с инвертированными детьми)
        return root;
    }
}
```

---

### 🔍 Как это работает:

1. **Базовый случай**: если `root == null` — дерево пустое, возвращаем `null`.
2. **Рекурсивный шаг**:
   - Сначала инвертируем **левое** поддерево → получаем новое правое
   - Затем инвертируем **правое** поддерево → получаем новое левое
3. **Меняем ссылки**: `root.left = right`, `root.right = left`
4. Возвращаем корень — теперь он указывает на зеркальное дерево.

---

### ⏱ Сложность:

- **Время**: `O(n)` — посещаем каждый узел один раз  
- **Память**: `O(h)` — глубина рекурсивного стека, где `h` — высота дерева  
  - В худшем случае (вырожденное дерево): `O(n)`  
  - В сбалансированном: `O(log n)`

---

✅ Это — **каноническое рекурсивное решение**, которое ожидают на собеседовании.
