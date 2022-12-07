## 图像数据集上传方法：

### 1.数据格式

需要上传两个文件，分别为**数据集压缩包`(zip文件)`**和**数据集标签列表`(csv文件)`**。
其中，zip压缩包内的图片名称和csv文件的图片名称一一对应。

#### 1.1 **数据集压缩包**

- 描述：将数据集以`.zip`格式压缩存储，压缩包内只包含图片。
- 命名格式：任意，例如 `myDataset1.zip`


#### 1.2 数据集标签列表

- 描述：将每张图片所对应的标签以`.csv`格式压缩存储（**逗号分隔**）。csv文件一共有**2**列。
  >`filename`: 图片文件名

  >`label`: 所属标签/类别

- 命名格式：任意，例如 `myDataset_labels.csv`


csv文件内容示例：

```csv
filename,label
leptodactylus_pentadactylus_s_000004.png,frog
camion_s_000148.png,truck
tipper_truck_s_001250.png,truck
american_elk_s_001521.png,deer
station_wagon_s_000293.png,car
coupe_s_001735.png,car
...
...
```
