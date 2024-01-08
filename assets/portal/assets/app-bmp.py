import cv2
import os
import time
import requests

def process(emp_id, socket_id, file_name):
    test = cv2.imread(file_name)

    best_score = 0
    filename = None
    image = None
    kp1, kp2, mp = None, None, None

    for file in [file for file in os.listdir("biometric/"+emp_id)][:1000]:
        fingerprint_image = cv2.imread("biometric/"+emp_id+"/"+file)
        sift = cv2.SIFT_create()

        keypoints_1, descriptors_1 = sift.detectAndCompute(test, None)
        keypoints_2, descriptors_2 = sift.detectAndCompute(fingerprint_image, None)

        matches = cv2.FlannBasedMatcher({'algorithm': 1, 'trees': 10}, {}).knnMatch(descriptors_1, descriptors_2, k=2)
        match_points = []

        # BEFORE 2024-01-05
        # for p, q in matches:
        #     if p.distance < 0.35 * q.distance:
        #         match_points.append(p)

        for p, q in matches:
            if p.distance < 0.25 * q.distance:
                match_points.append(p)
        
        keypoints = 0
        if len(keypoints_1) <= len(keypoints_2):
            keypoints = len(keypoints_1)            
        else:
            keypoints = len(keypoints_2)

        print(keypoints)
        if len(match_points) / keypoints * 100 > best_score:
            best_score = len(match_points) / keypoints * 100
            filename = file
            image = fingerprint_image
            kp1, kp2, mp = keypoints_1, keypoints_2, match_points

    print("BEST MATCH: "+str(filename))
    print("SCORE: "+str(best_score))

    os.remove(file_name)

    url = "http://192.168.100.116:8888/biometric/match/results"
    data = {'file': str(filename), 'score': str(best_score), 'socket_id': str(socket_id)}
    headers = {"Content-type": "application/x-www-form-urlencoded", "Accept":"text/plain"}
    requests.post(url, data=data, headers=headers)

    if best_score != 0:
        result = cv2.drawMatches(test, kp1, image, kp2, mp, None) 
        result = cv2.resize(result, None, fx=2, fy=1)
        main()

        # cv2.imshow("result", result)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()
    else:
        print('No ID Matched')
        main()

def main():
    counter = 0
    files = [f for f in os.listdir('.') if os.path.isfile(f)]
    for f in files:
        if '.bmp' in f:
            emp_id = f.split('.')[0].split('---')[0]
            socket_id = f.split('.')[0].split('---')[1]
            process(emp_id, socket_id, f)
            break
        counter += 1

    if len(files) == counter:
        print('nothing found')
        time.sleep(2)
        main()

main()