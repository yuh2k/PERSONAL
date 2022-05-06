def merge(L, R):
    size = len(L) + len(R)
    L.append(float('inf'))
    R.append(float('inf'))
    i = j = 0
    out = []
    for k in range(0, size):
        if L[i] <= R[j]:
            out.append(L[i])
            i += 1
        else:
            out.append(R[j])
            j += 1
    return out

def merge_sort(arr):
    length = len(arr)
    if length <= 1:
        return arr
    else:
        mid = length // 2
        left = merge_sort(arr[0:mid])
        right = merge_sort(arr[mid:])
        return merge(left,right)
