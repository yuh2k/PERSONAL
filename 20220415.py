# 1. hashtable


# 3 and 4 sum
def fourSum1(nums, target):
    nums.sort()

    def two_sum(nums, target):
        hashset, res = set(), []
        for num in nums:
            if target - num in hashset:
                res.append([target - num, num])
            hashset.add(num)
        return res
    
    
    # 3sum
    def three_sum(nums, target):
        res = []
        for i, num in enumerate(nums):
            sum_of_rest_two = target - num
            sub_array = nums[i + 1: len(nums)]
            temp_array = two_sum(sub_array, sum_of_rest_two)   # two_sum result of the subarray

            if temp_array:
                for item in temp_array:
                    if item + [num] not in res:
                        res.append(item + [num])      
        return res
    
    # 4sum
    def four_sum(nums, target):
        res = []
        for i, num in enumerate(nums):
            sum_of_rest_three = target - num
            sub_array = nums[i + 1: len(nums)]
            temp_array = three_sum(sub_array, sum_of_rest_three)   # three_sum result of the subarray
            if temp_array:
                for item in temp_array:
                    if item + [num] not in res:
                        res.append(item + [num])      
        return res

    return four_sum(nums, target)





# 2. two pointers

def threeSum(nums, target):
    
        if len(nums) <= 2: return []
        nums.sort()
        res = []

        for i, num in enumerate(nums):
            if i > 0 and nums[i-1] == nums[i]: continue   #remove duplicates
            left, right = i + 1, len(nums) - 1

            while left < right:
                sum1 = num + nums[left] + nums[right]

                if sum1 == target:
                    res.append([num, nums[left], nums[right]])
                    left += 1
                    right -= 1
                    
                    #remove duplicates
                    while left < right and nums[left - 1] == nums[left]:
                        left += 1
                    while left < right and nums[right + 1] == nums[right]:
                        right -= 1
                
                elif sum1 < target:
                    left += 1

                else:
                    right -= 1

        return res
    


def fourSum(nums, target):
    res = []
    if not nums or len(nums) < 4:
        return res

    nums.sort()
    length = len(nums)

    for i in range(length - 3):
        if i > 0 and nums[i] == nums[i - 1]: 
            continue

        for j in range(i + 1, length - 2):
            if j > i + 1 and nums[j] == nums[j - 1]: 
                continue
                
            left, right = j + 1, length - 1

            while left < right:
                sum1 = nums[i] + nums[j] + nums[left] + nums[right]
                if sum1 == target:
                    res.append([nums[i], nums[j], nums[left], nums[right]])

                    left += 1
                    right -= 1

                    while left < right and nums[left] == nums[left - 1]:
                        left += 1
                    while left < right and nums[right] == nums[right + 1]:
                        right -= 1   

                elif sum1 < target:
                    left += 1

                else:
                    right -= 1

    return res




tc1 = [1,2,3,0,-2,-1,1]
tc2 = [0,0,0,0,0]
tc3 = []
