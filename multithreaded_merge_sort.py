
import random
import math
import multiprocessing as mp
import time


def merge_sort(array):

    if len(array) <= 1:
        return array  
    mid = int(len(array) / 2)
    L, R = merge_sort(array[:mid]), merge_sort(array[mid:])

    return merge(L, R)


def merge(*args):
    if len(args) == 1:
        L, R = args[0]
    else:
        L, R = args
    
    result = []
    left = right = 0

    while left < len(L) and right < len(R):
        if L[left] < R[right]:
            result.append(L[left])
            left += 1

        else:
            result.append(R[right])
            right += 1

    result.extend(L[left:])
    result.extend(R[right:])

    return result

def mergeSortParallel(data, threads):
    pool = mp.Pool(processes = threads)
    size = int(math.ceil(   int(len(data))  /  threads  ))

    data = [data[i * size: (i + 1) * size] for i in range(threads)]
    data = pool.map(merge_sort, data)

    while len(data) > 1:
        if len(data) % 2 == 1:
            extra = data.pop() 
        else: 
            extra = None
        
        data = [(data[i], data[i + 1]) for i in range(0, len(data), 2)]
        data = pool.map(merge, data) + ([extra] if extra else [])

    return data[0]

if __name__ == "__main__":
    print('start')
    array = [random.randint(0, 10000) for i in range(10000)]
    res = []
    start_time = time.time()
    result = sorted(array)
    end_time = time.time()
    
    print("Built-in Sort:", end_time-start_time)

    max_threads = 12
    
    for i in range(1, max_threads + 1):
        start_time = time.time()
        result = mergeSortParallel(array, i)
        print(result)
        end_time = time.time()
        print("Threads:" , i, end_time - start_time,'s')
