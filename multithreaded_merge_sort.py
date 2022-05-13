
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
'''
Array Size: 100
Built-in Sort: 0.0 s
Threads: 1 0.24499869346618652 s
Threads: 2 0.24100208282470703 s
Threads: 3 0.2629990577697754 s
Threads: 4 0.2720012664794922 s
Threads: 5 0.2499992847442627 s
Threads: 6 0.2630014419555664 s
Threads: 7 0.288999080657959 s
Threads: 8 0.3210005760192871 s
Threads: 9 0.33099937438964844 s
Threads: 10 0.4180002212524414 s
Threads: 11 0.3620011806488037 s
Threads: 12 0.3819997310638428 s
'''

'''
Array Size: 1000
Built-in Sort: 0.0 s
Threads: 1 0.2279949188232422 s
Threads: 2 0.21599936485290527 s
Threads: 3 0.24400091171264648 s
Threads: 4 0.2369997501373291 s
Threads: 5 0.24700045585632324 s
Threads: 6 0.26599836349487305 s
Threads: 7 0.3020017147064209 s
Threads: 8 0.31800246238708496 s
Threads: 9 0.32399678230285645 s
Threads: 10 0.37199997901916504 s
Threads: 11 0.38900279998779297 s
Threads: 12 0.40599989891052246 s
'''

'''
Array Size: 10000
Built-in Sort: 0.0010001659393310547 s
Threads: 1 0.27899885177612305 s
Threads: 2 0.24399614334106445 s
Threads: 3 0.2709999084472656 s
Threads: 4 0.2500007152557373 s
Threads: 5 0.2629985809326172 s
Threads: 6 0.3040018081665039 s
Threads: 7 0.32399892807006836 s
Threads: 8 0.3280014991760254 s
Threads: 9 0.37000060081481934 s
Threads: 10 0.39600300788879395 s
Threads: 11 0.4360024929046631 s
Threads: 12 0.42499494552612305 s
'''



'''
Array Size: 10000
Built-in Sort: 0.0009996891021728516 s
Threads: 1 0.2540006637573242 s
Threads: 2 0.24300098419189453 s
Threads: 3 0.24799823760986328 s
Threads: 4 0.24700236320495605 s
Threads: 5 0.25499892234802246 s
Threads: 6 0.2820007801055908 s
Threads: 7 0.331998348236084 s
Threads: 8 0.33300113677978516 s
Threads: 9 0.40599870681762695 s
Threads: 10 0.4099996089935303 s
Threads: 11 0.4099998474121094 s
Threads: 12 0.4360008239746094 s
'''

'''
Array Size: 100000
Built-in Sort: 0.016000747680664062 s
Threads: 1 0.5910015106201172 s
Threads: 2 0.43999695777893066 s
Threads: 3 0.41100096702575684 s
Threads: 4 0.3810007572174072 s
Threads: 5 0.4310014247894287 s
Threads: 6 0.4349977970123291 s
Threads: 7 0.42200136184692383 s
Threads: 8 0.45400118827819824 s
Threads: 9 0.49199867248535156 s
Threads: 10 0.5680007934570312 s
Threads: 11 0.6100010871887207 s
Threads: 12 0.7169954776763916 s
'''

'''
Array Size: 1000000
Built-in Sort: 0.1900007724761963 s
Threads: 1 4.974001407623291 s
Threads: 2 3.0560247898101807 s
Threads: 3 2.7129666805267334 s
Threads: 4 2.2349984645843506 s
Threads: 5 2.265010356903076 s
Threads: 6 1.9400005340576172 s
Threads: 7 1.8750014305114746 s
Threads: 8 1.7968204021453857 s
Threads: 9 2.03899884223938 s
Threads: 10 2.060025453567505 s
Threads: 11 1.9439728260040283 s
Threads: 12 1.9990031719207764 s
'''
