import React, { FC, useState } from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import useSet from "../../hooks/useSet";

interface TestComponentProps {
  initialItems?: string[];
}

// A test component that uses the hook
const TestComponent: FC<TestComponentProps> = ({ initialItems = [] }) => {
  const [set, { add, remove, clear, has, toggle }] =
    useSet<string>(initialItems);

  // Convert Set to sorted Array for display
  const items = Array.from(set).sort();

  return (
    <div>
      <div data-testid="items">
        {items.length > 0 ? items.join(", ") : "Empty set"}
      </div>
      <div>
        <input data-testid="input" type="text" id="item" />
        <button
          data-testid="add-button"
          onClick={() => {
            const input = document.getElementById("item") as HTMLInputElement;
            add(input.value);
            input.value = "";
          }}
        >
          Add Item
        </button>
        <button
          data-testid="remove-button"
          onClick={() => {
            const input = document.getElementById("item") as HTMLInputElement;
            remove(input.value);
            input.value = "";
          }}
        >
          Remove Item
        </button>
        <button
          data-testid="toggle-button"
          onClick={() => {
            const input = document.getElementById("item") as HTMLInputElement;
            toggle(input.value);
            input.value = "";
          }}
        >
          Toggle Item
        </button>
        <button data-testid="clear-button" onClick={clear}>
          Clear Set
        </button>
      </div>
      <div>
        <input data-testid="check-input" type="text" id="checkItem" />
        <button
          data-testid="check-button"
          onClick={() => {
            const input = document.getElementById(
              "checkItem"
            ) as HTMLInputElement;
            const result = has(input.value);
            const resultElement = document.getElementById("check-result");
            if (resultElement) {
              resultElement.textContent = result
                ? "Item exists"
                : "Item does not exist";
            }
          }}
        >
          Check Item
        </button>
        <div data-testid="check-result" id="check-result"></div>
      </div>
    </div>
  );
};

interface TestObject {
  id: number;
  name: string;
}

describe("useSet", () => {
  test("should initialize with empty set by default", () => {
    render(<TestComponent />);

    expect(screen.getByTestId("items").textContent).toBe("Empty set");
  });

  test("should initialize with provided initial items", () => {
    render(<TestComponent initialItems={["apple", "banana", "orange"]} />);

    expect(screen.getByTestId("items").textContent).toBe(
      "apple, banana, orange"
    );
  });

  test("should add items to the set", () => {
    render(<TestComponent />);

    const input = screen.getByTestId("input") as HTMLInputElement;
    const addButton = screen.getByTestId("add-button");

    // Add first item
    act(() => {
      fireEvent.change(input, { target: { value: "apple" } });
      fireEvent.click(addButton);
    });

    expect(screen.getByTestId("items").textContent).toBe("apple");

    // Add second item
    act(() => {
      fireEvent.change(input, { target: { value: "banana" } });
      fireEvent.click(addButton);
    });

    expect(screen.getByTestId("items").textContent).toBe("apple, banana");
  });

  test("should not add duplicate items", () => {
    render(<TestComponent initialItems={["apple"]} />);

    const input = screen.getByTestId("input") as HTMLInputElement;
    const addButton = screen.getByTestId("add-button");

    // Try to add duplicate item
    act(() => {
      fireEvent.change(input, { target: { value: "apple" } });
      fireEvent.click(addButton);
    });

    // Set should still contain only one 'apple'
    expect(screen.getByTestId("items").textContent).toBe("apple");

    // Add unique item
    act(() => {
      fireEvent.change(input, { target: { value: "banana" } });
      fireEvent.click(addButton);
    });

    expect(screen.getByTestId("items").textContent).toBe("apple, banana");
  });

  test("should remove items from the set", () => {
    render(<TestComponent initialItems={["apple", "banana", "orange"]} />);

    const input = screen.getByTestId("input") as HTMLInputElement;
    const removeButton = screen.getByTestId("remove-button");

    // Remove an item
    act(() => {
      fireEvent.change(input, { target: { value: "banana" } });
      fireEvent.click(removeButton);
    });

    expect(screen.getByTestId("items").textContent).toBe("apple, orange");

    // Try to remove an item that doesn't exist
    act(() => {
      fireEvent.change(input, { target: { value: "grape" } });
      fireEvent.click(removeButton);
    });

    // Set should remain unchanged
    expect(screen.getByTestId("items").textContent).toBe("apple, orange");
  });

  test("should clear all items from the set", () => {
    render(<TestComponent initialItems={["apple", "banana", "orange"]} />);

    const clearButton = screen.getByTestId("clear-button");

    // Clear all items
    act(() => {
      fireEvent.click(clearButton);
    });

    expect(screen.getByTestId("items").textContent).toBe("Empty set");
  });

  test("should check if item exists in the set", () => {
    render(<TestComponent initialItems={["apple", "banana"]} />);

    const checkInput = screen.getByTestId("check-input") as HTMLInputElement;
    const checkButton = screen.getByTestId("check-button");
    const checkResult = screen.getByTestId("check-result");

    // Check for existing item
    act(() => {
      fireEvent.change(checkInput, { target: { value: "apple" } });
      fireEvent.click(checkButton);
    });

    expect(checkResult.textContent).toBe("Item exists");

    // Check for non-existing item
    act(() => {
      fireEvent.change(checkInput, { target: { value: "grape" } });
      fireEvent.click(checkButton);
    });

    expect(checkResult.textContent).toBe("Item does not exist");
  });

  test("should toggle items in the set", () => {
    render(<TestComponent initialItems={["apple"]} />);

    const input = screen.getByTestId("input") as HTMLInputElement;
    const toggleButton = screen.getByTestId("toggle-button");

    // Toggle existing item (remove it)
    act(() => {
      fireEvent.change(input, { target: { value: "apple" } });
      fireEvent.click(toggleButton);
    });

    expect(screen.getByTestId("items").textContent).toBe("Empty set");

    // Toggle non-existing item (add it)
    act(() => {
      fireEvent.change(input, { target: { value: "banana" } });
      fireEvent.click(toggleButton);
    });

    expect(screen.getByTestId("items").textContent).toBe("banana");
  });

  test("should handle complex data types", () => {
    // Modified component that correctly shows the test
    const ComplexTypesComponent: FC = () => {
      const [set, { add, has }] = useSet<TestObject>();
      const [objectInSet, setObjectInSet] = useState<TestObject | null>(null);
      const [hasOriginal, setHasOriginal] = useState<boolean>(false);
      const [hasEquivalent, setHasEquivalent] = useState<boolean>(false);

      // Add object button handler
      const handleAddObject = () => {
        const obj1: TestObject = { id: 1, name: "Object 1" };
        add(obj1);
        setObjectInSet(obj1);
      };

      // Check button handler
      const handleCheck = () => {
        if (objectInSet) {
          setHasOriginal(has(objectInSet));
          setHasEquivalent(has({ id: 1, name: "Object 1" }));
        }
      };

      return (
        <div>
          <button data-testid="add-object" onClick={handleAddObject}>
            Add Object
          </button>
          <button data-testid="check-objects" onClick={handleCheck}>
            Check Objects
          </button>
          <div data-testid="has-original">
            {hasOriginal
              ? "Has original object"
              : "Does not have original object"}
          </div>
          <div data-testid="has-equivalent">
            {hasEquivalent
              ? "Has equivalent object"
              : "Does not have equivalent object"}
          </div>
          <div data-testid="set-size">Size: {set.size}</div>
        </div>
      );
    };

    render(<ComplexTypesComponent />);

    // Initial state
    expect(screen.getByTestId("set-size").textContent).toBe("Size: 0");
    expect(screen.getByTestId("has-original").textContent).toBe(
      "Does not have original object"
    );

    // Add an object
    act(() => {
      fireEvent.click(screen.getByTestId("add-object"));
    });

    // Set should contain the object (size check)
    expect(screen.getByTestId("set-size").textContent).toBe("Size: 1");

    // Now explicitly check if the objects are in the set
    act(() => {
      fireEvent.click(screen.getByTestId("check-objects"));
    });

    // The original object should be found
    expect(screen.getByTestId("has-original").textContent).toBe(
      "Has original object"
    );

    // But not an equivalent object with different reference
    expect(screen.getByTestId("has-equivalent").textContent).toBe(
      "Does not have equivalent object"
    );
  });
});
