import cv2
import os

fingerprint_test = cv2.imread("test.tif", cv2.IMREAD_GRAYSCALE)
cv2.imshow("Original", cv2.resize(fingerprint_test, None, fx=1, fy=1))
emp_id = "5000"
# cv2.waitKey(0)
# cv2.destroyAllWindows()

arr = [file for file in os.listdir("biometric/" + emp_id)]
for index, file in enumerate(arr):
    fingerprint_database_image = cv2.imread("./biometric/" + emp_id + "/" +file, cv2.IMREAD_GRAYSCALE)
    sift = cv2.xfeatures2d.SIFT_create()
    keypoints_1, descriptors_1 = sift.detectAndCompute(fingerprint_test, None)
    keypoints_2, descriptors_2 = sift.detectAndCompute(fingerprint_database_image, None)

    matches = cv2.FlannBasedMatcher(dict(algorithm=1, trees=10), 
                dict()).knnMatch(descriptors_1, descriptors_2, k=2)
    match_points = []

    for p, q in matches:
        if p.distance < (0.935555*q.distance):
            match_points.append(p)
    
    keypoints = 0
    if len(keypoints_1) <= len(keypoints_2):
        keypoints = len(keypoints_1)            
    else:
        keypoints = len(keypoints_2)

    print(str(file) + ": " + str((len(match_points) / keypoints)))
    if (len(match_points) / keypoints) > 0.65:
        print("% match: ", len(match_points) / keypoints * 100)
        print("Figerprint ID: " + str(file)) 
        result = cv2.drawMatches(fingerprint_test, keypoints_1, fingerprint_database_image, 
                                keypoints_2, match_points, None) 
        result = cv2.resize(result, None, fx=2.5, fy=2.5)
        # cv2.imshow("result", result)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()
        break
    if index == len(arr)-1:
        print("No ID Matched!!")