import cv2
import time

#Works well with images of different dimensions
def orb_sim(img1, img2):
    # SIFT is no longer available in cv2 so using ORB
    orb = cv2.ORB_create()

    # detect keypoints and descriptors
    kp_a, desc_a = orb.detectAndCompute(img1, None)
    kp_b, desc_b = orb.detectAndCompute(img2, None)

    # define the bruteforce matcher object
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

    #perform matches. 
    matches = bf.match(desc_a, desc_b)
    #Look for similar regions with distance < 50. Goes from 0 to 100 so pick a number between.
    similar_regions = [i for i in matches if i.distance < 50]  
    if len(matches) == 0:
        return 0
    return len(similar_regions) / len(matches)

img00 = cv2.imread('../assets/portal/assets/images/signatures/signature.png', 0)
img01 = ""

while True:
    img01 = cv2.imread('../assets/portal/assets/images/signatures/signature_to_match.png', 0)
    if (img01 & type(img01) != None).any():
        orb_similarity = orb_sim(img00, img01)  #1.0 means identical. Lower = not similar
        print("Similarity using ORB is: ", orb_similarity)
    else:
        print('No Signature Found')
    time.sleep(1)
