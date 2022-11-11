## 文本数据集上传方法：

### 1.支持类型

目前**仅**支持**英文**文本数据集，中文文本数据集的支持敬请期待。

### 1.数据格式

只需上传一个文件data.csv

- 描述：将数据集以`.csv`格式压缩存储

- 命名格式：`data.csv`

  

csv文件一共有**4**列。

- `source_id`: 图片唯一标识符
- `source_content`:文本内容
- `source_tags`: 所属标签/类别
- `source_type`: 分别表示数据的类型

其结构如下：

| source_id | source_content                                               | source_tags                | source_type |
| --------- | ------------------------------------------------------------ | -------------------------- | ----------- |
| 1         | Comparative study of Discrete Wavelet Transforms and Wavelet Tensor Train ... | ComputerScience,Statistics |             |
| 2         | On maximizing the fundamental frequency of the complement ... | Mathematics                |             |
| 3         | Adverse effects of polymer coating on heat transport at ...  | Physics                    | test        |
| ...       | ...                                                          | ...                        | ...         |

- 注意，对于`source_type`这一列，可选的选项为
  - 'test' <span style='color:#f00'>**(必须包含)**</span>。表示该数据属于**测试集**。

  - 'labeled'(可选)。表示该数据属于**初始集**。若未选，则创建任务时**随机**选择初始集，进行**预标注**。



### 2.常见问题 FAQ

1. 如何设置数据集能够标注的标签？

   答：将从测试集对应的标签中进行解析。
