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

    class_id = []
    for box in result.boxes:
      class_id.append(result.names[box.cls[0].item()])
    return {"result" : class_id,"status":"ok"}
  
  except:
    return {"result":"An error occured while classifying!","status":"error"}

print(json.dumps(classifyImage()))

sys.stdout.flush()