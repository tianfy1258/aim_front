## 模型上传方法：

### 1.数据格式

需要上传三个文件，分别为**模型定义文件`(py文件)`、模型权重文件`(pt文件)`**和**模型标签列表`(txt文件)`**。

#### 1.1 **模型定义文件**

- 命名格式：任意，例如 `myModel.py`。

示例代码：

```python
import torch.nn as nn
import numpy as np
import torchvision.transforms as transforms


class LeNet(nn.Module):

    def __init__(self, num_classes=10):
        super(LeNet, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(in_channels=3, out_channels=6, kernel_size=5),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(6, 16, 5),
            nn.ReLU(True),
            nn.MaxPool2d(2, 2),
        )
        self.classifier = nn.Sequential(
            nn.Linear(16 * 5 * 5, 120),
            nn.ReLU(True),
            nn.Linear(120, 84),
            nn.ReLU(True),
            nn.Linear(84, num_classes),
        )

    def forward(self, x):
        x = self.features(x)
        x = x.view(-1, 16 * 5 * 5)
        x = self.classifier(x)
        return x


def image_process(image: np.ndarray):
    """
    :param image: 长为H宽为W的一张RGB图片，由numpy矩阵表示，大小为(H,W,C)
    :return: 处理后的图片，大小为(C,H,W)
    """
    transform = transforms.Compose(
        [transforms.ToTensor(),
         transforms.Resize([32,32]),
         transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])

    return transform(image)
```

说明：该文件包含模型`LeNet`的定义类，包含图片预处理方法`image_process`，类名和方法名不限。但有两点要求：

1. 模型的输出必须为二维`torch.Tensor`矩阵，两个维度表示（批量大小，标签数量）。
2. 图片处理方法的输入必须为一个三维`numpy.ndarray`矩阵，三个维度表示（高度，宽度，通道数）。输出必须为一个`torch.Tensor`三维矩阵，三个维度表示（通道数，高度，宽度）。

#### 1.2 模型权重文件

- 描述：pytorch模型的权重文件。
- 命名格式：任意，例如 `myModel.pt`

用户可以通过下列的方式保存模型文件：

```python
model = LeNet()
# ... 此处省略模型训练代码
torch.save(model.state_dict(),"./myModel.pt")
```

用户将保存的pt文件上传即可，系统将会通过下面的代码读取模型文件。

```python
model.load_state_dict(
	torch.load("./myModel.pt")
)
```

#### 1.3 模型标签文件

- 描述：pytorch模型的标签文件，用于解释模型的输出。
- 命名格式：任意，例如 `myModel.txt`

示例：

```
plane
car
bird
cat
deer
dog
frog
horse
ship
truck
```