def fourSum1(nums, target):

    nums.sort()

    def two_sum(nums, target):
        hashset, res = set(), []
        for num in nums:
            if target - num in hashset:
                res.append([target - num, num])
            hashset.add(num)
        return res

    def three_sum(nums, target):
        res = []
        for i, num in enumerate(nums):
            sum_of_rest_two = target - num
            sub_array = nums[i + 1: len(nums)]
            temp_array = two_sum(sub_array, sum_of_rest_two)   # two sum result of the subarray

            if temp_array:
                for item in temp_array:
                    if item + [num] not in res:
                        res.append(item + [num])      
        return res

    def four_sum(nums, target):
        res = []
        for i, num in enumerate(nums):
            sum_of_rest_three = target - num
            sub_array = nums[i + 1: len(nums)]
            temp_array = three_sum(sub_array, sum_of_rest_three)   # two sum result of the subarray
            if temp_array:
                for item in temp_array:
                    if item + [num] not in res:
                        res.append(item + [num])      
        return res

    return four_sum(nums, target)



