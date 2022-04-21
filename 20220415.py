# hash
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



# two pointers

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
                    while left < right and nums[left - 1] == nums[left]: #remove duplicates
                        left += 1
                else:
                    right -= 1
                    while left < right and nums[right + 1] == nums[right]: #remove duplicates
                        right -= 1
        return res
    



