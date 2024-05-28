# Time Complexity: O(log(n))
def find_number(array: list[int], target: int) -> int:
    if not array:
        return -1
    left, right = 0, len(array) - 1

    # Find the pivot index
    while left < right:
        mid = left + (right - left) // 2
        if array[mid] > array[right]:
            left = mid + 1
        else:
            right = mid

    pivot = left
    left, right = 0, len(array) - 1

    # Determine which half to search
    if target >= array[pivot] and target <= array[right]:
        left = pivot
    else:
        right = pivot - 1

    # Perform binary search
    while left <= right:
        mid = left + (right - left) // 2
        if array[mid] == target:
            return mid
        elif array[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1


# Time Complexity: O(n)
def find_number_linear(array: list[int], target: int) -> int:
    for i, num in enumerate(array):
        if num == target:
            return i
    return -1


if __name__ == "__main__":
    print(find_number([5, 6, 7, 0, 1, 2, 4], 3))
    print(find_number([4, 5, 6, 7, 0, 1, 2], 0))
    print(find_number([], 3))
    print(find_number([1], 0))
    print(find_number([1], 1))
