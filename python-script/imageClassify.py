from ultralytics import YOLO
import sys
import json

def classifyImage():
  try:
    model_source = sys.argv[1]
    image_source = sys.argv[2]

    model = YOLO(model_source)

    results = model.predict(image_source,save=False,verbose=False)

    result = results[0]

    objects = []
    for box in result.boxes:
      detected_object = {"item": result.names[box.cls[0].item()], "prob":round(box.conf[0].item(), 2)}
      objects.append(detected_object)
    return {"result" : objects,"status":"ok"}
  
  except:
    return {"result":"An error occured while classifying!","status":"error"}

print(json.dumps(classifyImage()))

sys.stdout.flush()