---
tags:
- sentence-transformers
- sentence-similarity
- feature-extraction
- generated_from_trainer
- dataset_size:74
- loss:CosineSimilarityLoss
base_model: sentence-transformers/all-MiniLM-L6-v2
widget:
- source_sentence: Photosynthesis is the process that allows plants to convert sunlight
    into chemical energy. However, some scientists argue that the theory of relativity,
    developed by einstein, explains the relationship between space and time, which
    is not entirely correct.
  sentences:
  - Photosynthesis is the process that allows plants to convert sunlight into chemical
    energy. It occurs in the chloroplasts of green plants, where chlorophyll captures
    sunlight. This energy helps in transforming carbon dioxide and water into glucose
    and oxygen. Oxygen is then released into the atmosphere, making the air breathable
    for living organisms. Without photosynthesis, life on Earth would not be able
    to sustain itself.
  - Global warming is a major environmental issue caused by human activities. Burning
    fossil fuels releases greenhouse gases, which trap heat in the Earth's atmosphere.
    As a result, global temperatures rise, leading to melting ice caps and rising
    sea levels. Extreme weather conditions such as hurricanes and droughts become
    more frequent. To combat global warming, the use of renewable energy sources and
    conservation efforts are essential.
  - Operating systems serve as the backbone of computing devices by managing hardware
    and software resources. They provide a user interface and enable applications
    to run efficiently. Popular operating systems include Windows, macOS, and Linux.
    Key functions include process management, memory allocation, and file system organization.
    With the rise of mobile computing, operating systems like Android and iOS have
    become widely used.
- source_sentence: Internet of Things (IoT) connects everyday objects to the internet
    for data exchange. However, it also incorrectly assumes that cybersecurity is
    about designing new programming languages rather than protecting systems from
    attacks. which is not accurate.
  sentences:
  - Software testing ensures the quality and reliability of applications before deployment.
    It includes techniques like unit testing, integration testing, and regression
    testing. Automation tools such as Selenium and JUnit help streamline testing processes.
    Software testing helps identify bugs early, reducing development costs. With Agile
    and DevOps methodologies, continuous testing has become a standard practice.
  - Internet of Things (IoT) connects everyday objects to the internet for data exchange.
    IoT applications include smart homes, wearable devices, and industrial automation.
    It relies on sensors, embedded systems, and wireless communication. Security risks
    in IoT include unauthorized access and data breaches. With advancements in AI,
    IoT devices are becoming smarter and more autonomous.
  - Edge computing brings computation and data storage closer to data sources. It
    reduces latency and enhances real-time processing in IoT applications. Unlike
    cloud computing, edge computing processes data locally before sending it to central
    servers. Use cases include autonomous vehicles, smart cameras, and remote healthcare.
    As IoT devices grow, edge computing is becoming essential for efficiency and security.
- source_sentence: 'Big data refers to extremely large datasets that require specialized
    processing techniques. It is characterized by the three Vs: volume, velocity,
    and variety. Big data technologies include Hadoop, Apache Spark, and distributed
    databases. Industries use big data analytics for insights in healthcare, finance,
    and marketing. With the rise of the Internet of Things (IoT), big data continues
    to grow exponentially.'
  sentences:
  - 'Big data refers to extremely large datasets that require specialized processing
    techniques. It is characterized by the three Vs: volume, velocity, and variety.
    Big data technologies include Hadoop, Apache Spark, and distributed databases.
    Industries use big data analytics for insights in healthcare, finance, and marketing.
    With the rise of the Internet of Things (IoT), big data continues to grow exponentially.'
  - Global warming is a major environmental issue caused by human activities. Burning
    fossil fuels releases greenhouse gases, which trap heat in the Earth's atmosphere.
    As a result, global temperatures rise, leading to melting ice caps and rising
    sea levels. Extreme weather conditions such as hurricanes and droughts become
    more frequent. To combat global warming, the use of renewable energy sources and
    conservation efforts are essential.
  - Machine learning is a branch of artificial intelligence that enables systems to
    learn from data and improve over time. It involves training algorithms on large
    datasets to recognize patterns and make predictions. Supervised, unsupervised,
    and reinforcement learning are its primary types. Applications include fraud detection,
    recommendation systems, and autonomous vehicles. Machine learning continues to
    revolutionize industries by enabling automation and intelligent decision-making.
- source_sentence: The theory of relativity, developed by Einstein, explains the relationship
    between space and time. It revolutionized our understanding of physics and the
    universe.
  sentences:
  - Global warming is a major environmental issue caused by human activities. Burning
    fossil fuels releases greenhouse gases, which trap heat in the Earth's atmosphere.
    As a result, global temperatures rise, leading to melting ice caps and rising
    sea levels. Extreme weather conditions such as hurricanes and droughts become
    more frequent. To combat global warming, the use of renewable energy sources and
    conservation efforts are essential.
  - Edge computing brings computation and data storage closer to data sources. It
    reduces latency and enhances real-time processing in IoT applications. Unlike
    cloud computing, edge computing processes data locally before sending it to central
    servers. Use cases include autonomous vehicles, smart cameras, and remote healthcare.
    As IoT devices grow, edge computing is becoming essential for efficiency and security.
  - Photosynthesis is the process that allows plants to convert sunlight into chemical
    energy. It occurs in the chloroplasts of green plants, where chlorophyll captures
    sunlight. This energy helps in transforming carbon dioxide and water into glucose
    and oxygen. Oxygen is then released into the atmosphere, making the air breathable
    for living organisms. Without photosynthesis, life on Earth would not be able
    to sustain itself.
- source_sentence: A database management system (DBMS) is software that allows users
    to store, retrieve, and manage data efficiently. However, it also incorrectly
    assumes that quantum computing is the same as classical computing but just runs
    slightly faster. which is not accurate.
  sentences:
  - A database management system (DBMS) is software that allows users to store, retrieve,
    and manage data efficiently. It provides structured query language (SQL) for interacting
    with databases. DBMS ensures data consistency, security, and integrity through
    ACID properties. Popular database management systems include MySQL, PostgreSQL,
    and MongoDB. With the rise of big data, modern DBMS solutions continue to evolve
    to handle massive volumes of information.
  - Digestion is the process by which the body breaks down food into nutrients. It
    begins in the mouth, where enzymes start breaking down carbohydrates. The stomach
    further processes food using acids and digestive enzymes. Nutrients are then absorbed
    in the intestines and transported to cells through the bloodstream. Any undigested
    food is expelled from the body as waste.
  - A database management system (DBMS) is software that allows users to store, retrieve,
    and manage data efficiently. It provides structured query language (SQL) for interacting
    with databases. DBMS ensures data consistency, security, and integrity through
    ACID properties. Popular database management systems include MySQL, PostgreSQL,
    and MongoDB. With the rise of big data, modern DBMS solutions continue to evolve
    to handle massive volumes of information.
pipeline_tag: sentence-similarity
library_name: sentence-transformers
---

# SentenceTransformer based on sentence-transformers/all-MiniLM-L6-v2

This is a [sentence-transformers](https://www.SBERT.net) model finetuned from [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2). It maps sentences & paragraphs to a 384-dimensional dense vector space and can be used for semantic textual similarity, semantic search, paraphrase mining, text classification, clustering, and more.

## Model Details

### Model Description
- **Model Type:** Sentence Transformer
- **Base model:** [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) <!-- at revision c9745ed1d9f207416be6d2e6f8de32d1f16199bf -->
- **Maximum Sequence Length:** 256 tokens
- **Output Dimensionality:** 384 dimensions
- **Similarity Function:** Cosine Similarity
<!-- - **Training Dataset:** Unknown -->
<!-- - **Language:** Unknown -->
<!-- - **License:** Unknown -->

### Model Sources

- **Documentation:** [Sentence Transformers Documentation](https://sbert.net)
- **Repository:** [Sentence Transformers on GitHub](https://github.com/UKPLab/sentence-transformers)
- **Hugging Face:** [Sentence Transformers on Hugging Face](https://huggingface.co/models?library=sentence-transformers)

### Full Model Architecture

```
SentenceTransformer(
  (0): Transformer({'max_seq_length': 256, 'do_lower_case': False}) with Transformer model: BertModel 
  (1): Pooling({'word_embedding_dimension': 384, 'pooling_mode_cls_token': False, 'pooling_mode_mean_tokens': True, 'pooling_mode_max_tokens': False, 'pooling_mode_mean_sqrt_len_tokens': False, 'pooling_mode_weightedmean_tokens': False, 'pooling_mode_lasttoken': False, 'include_prompt': True})
  (2): Normalize()
)
```

## Usage

### Direct Usage (Sentence Transformers)

First install the Sentence Transformers library:

```bash
pip install -U sentence-transformers
```

Then you can load this model and run inference.
```python
from sentence_transformers import SentenceTransformer

# Download from the 🤗 Hub
model = SentenceTransformer("sentence_transformers_model_id")
# Run inference
sentences = [
    'A database management system (DBMS) is software that allows users to store, retrieve, and manage data efficiently. However, it also incorrectly assumes that quantum computing is the same as classical computing but just runs slightly faster. which is not accurate.',
    'A database management system (DBMS) is software that allows users to store, retrieve, and manage data efficiently. It provides structured query language (SQL) for interacting with databases. DBMS ensures data consistency, security, and integrity through ACID properties. Popular database management systems include MySQL, PostgreSQL, and MongoDB. With the rise of big data, modern DBMS solutions continue to evolve to handle massive volumes of information.',
    'A database management system (DBMS) is software that allows users to store, retrieve, and manage data efficiently. It provides structured query language (SQL) for interacting with databases. DBMS ensures data consistency, security, and integrity through ACID properties. Popular database management systems include MySQL, PostgreSQL, and MongoDB. With the rise of big data, modern DBMS solutions continue to evolve to handle massive volumes of information.',
]
embeddings = model.encode(sentences)
print(embeddings.shape)
# [3, 384]

# Get the similarity scores for the embeddings
similarities = model.similarity(embeddings, embeddings)
print(similarities.shape)
# [3, 3]
```

<!--
### Direct Usage (Transformers)

<details><summary>Click to see the direct usage in Transformers</summary>

</details>
-->

<!--
### Downstream Usage (Sentence Transformers)

You can finetune this model on your own dataset.

<details><summary>Click to expand</summary>

</details>
-->

<!--
### Out-of-Scope Use

*List how the model may foreseeably be misused and address what users ought not to do with the model.*
-->

<!--
## Bias, Risks and Limitations

*What are the known or foreseeable issues stemming from this model? You could also flag here known failure cases or weaknesses of the model.*
-->

<!--
### Recommendations

*What are recommendations with respect to the foreseeable issues? For example, filtering explicit content.*
-->

## Training Details

### Training Dataset

#### Unnamed Dataset

* Size: 74 training samples
* Columns: <code>sentence_0</code>, <code>sentence_1</code>, and <code>label</code>
* Approximate statistics based on the first 74 samples:
  |         | sentence_0                                                                          | sentence_1                                                                          | label                                                           |
  |:--------|:------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------|:----------------------------------------------------------------|
  | type    | string                                                                              | string                                                                              | float                                                           |
  | details | <ul><li>min: 15 tokens</li><li>mean: 57.27 tokens</li><li>max: 104 tokens</li></ul> | <ul><li>min: 71 tokens</li><li>mean: 81.66 tokens</li><li>max: 101 tokens</li></ul> | <ul><li>min: 0.0</li><li>mean: 0.63</li><li>max: 0.99</li></ul> |
* Samples:
  | sentence_0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | sentence_1                                                                                                                                                                                                                                                                                                                                                                                                                                           | label             |
  |:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------|
  | <code>The same concept is explained in a different way. Cyber-physical systems (CPS) integrate computing and physical processes to enable real-time control. Examples include smart grids, autonomous vehicles, and industrial automation. CPS relies on sensors, actuators, and networked communication. Security challenges include vulnerabilities to cyber attacks and data breaches. The advancement of CPS is revolutionizing sectors like healthcare, transportation, and manufacturing.</code> | <code>Cyber-physical systems (CPS) integrate computing and physical processes to enable real-time control. Examples include smart grids, autonomous vehicles, and industrial automation. CPS relies on sensors, actuators, and networked communication. Security challenges include vulnerabilities to cyber attacks and data breaches. The advancement of CPS is revolutionizing sectors like healthcare, transportation, and manufacturing.</code> | <code>0.93</code> |
  | <code>The French Revolution led to the rise of democracy and the fall of monarchy in France. It was a turning point in world history that reshaped political structures.</code>                                                                                                                                                                                                                                                                                                                        | <code>Digestion is the process by which the body breaks down food into nutrients. It begins in the mouth, where enzymes start breaking down carbohydrates. The stomach further processes food using acids and digestive enzymes. Nutrients are then absorbed in the intestines and transported to cells through the bloodstream. Any undigested food is expelled from the body as waste.</code>                                                      | <code>0.06</code> |
  | <code>Digestion is the process by which the body breaks down food into nutrients. Essentially, it refers to the way  it begins in the mouth, where enzymes start breaking down carbohydrates but explained differently using alternative phrasing.</code>                                                                                                                                                                                                                                              | <code>Digestion is the process by which the body breaks down food into nutrients. It begins in the mouth, where enzymes start breaking down carbohydrates. The stomach further processes food using acids and digestive enzymes. Nutrients are then absorbed in the intestines and transported to cells through the bloodstream. Any undigested food is expelled from the body as waste.</code>                                                      | <code>0.94</code> |
* Loss: [<code>CosineSimilarityLoss</code>](https://sbert.net/docs/package_reference/sentence_transformer/losses.html#cosinesimilarityloss) with these parameters:
  ```json
  {
      "loss_fct": "torch.nn.modules.loss.MSELoss"
  }
  ```

### Training Hyperparameters
#### Non-Default Hyperparameters

- `num_train_epochs`: 4
- `multi_dataset_batch_sampler`: round_robin

#### All Hyperparameters
<details><summary>Click to expand</summary>

- `overwrite_output_dir`: False
- `do_predict`: False
- `eval_strategy`: no
- `prediction_loss_only`: True
- `per_device_train_batch_size`: 8
- `per_device_eval_batch_size`: 8
- `per_gpu_train_batch_size`: None
- `per_gpu_eval_batch_size`: None
- `gradient_accumulation_steps`: 1
- `eval_accumulation_steps`: None
- `torch_empty_cache_steps`: None
- `learning_rate`: 5e-05
- `weight_decay`: 0.0
- `adam_beta1`: 0.9
- `adam_beta2`: 0.999
- `adam_epsilon`: 1e-08
- `max_grad_norm`: 1
- `num_train_epochs`: 4
- `max_steps`: -1
- `lr_scheduler_type`: linear
- `lr_scheduler_kwargs`: {}
- `warmup_ratio`: 0.0
- `warmup_steps`: 0
- `log_level`: passive
- `log_level_replica`: warning
- `log_on_each_node`: True
- `logging_nan_inf_filter`: True
- `save_safetensors`: True
- `save_on_each_node`: False
- `save_only_model`: False
- `restore_callback_states_from_checkpoint`: False
- `no_cuda`: False
- `use_cpu`: False
- `use_mps_device`: False
- `seed`: 42
- `data_seed`: None
- `jit_mode_eval`: False
- `use_ipex`: False
- `bf16`: False
- `fp16`: False
- `fp16_opt_level`: O1
- `half_precision_backend`: auto
- `bf16_full_eval`: False
- `fp16_full_eval`: False
- `tf32`: None
- `local_rank`: 0
- `ddp_backend`: None
- `tpu_num_cores`: None
- `tpu_metrics_debug`: False
- `debug`: []
- `dataloader_drop_last`: False
- `dataloader_num_workers`: 0
- `dataloader_prefetch_factor`: None
- `past_index`: -1
- `disable_tqdm`: False
- `remove_unused_columns`: True
- `label_names`: None
- `load_best_model_at_end`: False
- `ignore_data_skip`: False
- `fsdp`: []
- `fsdp_min_num_params`: 0
- `fsdp_config`: {'min_num_params': 0, 'xla': False, 'xla_fsdp_v2': False, 'xla_fsdp_grad_ckpt': False}
- `tp_size`: 0
- `fsdp_transformer_layer_cls_to_wrap`: None
- `accelerator_config`: {'split_batches': False, 'dispatch_batches': None, 'even_batches': True, 'use_seedable_sampler': True, 'non_blocking': False, 'gradient_accumulation_kwargs': None}
- `deepspeed`: None
- `label_smoothing_factor`: 0.0
- `optim`: adamw_torch
- `optim_args`: None
- `adafactor`: False
- `group_by_length`: False
- `length_column_name`: length
- `ddp_find_unused_parameters`: None
- `ddp_bucket_cap_mb`: None
- `ddp_broadcast_buffers`: False
- `dataloader_pin_memory`: True
- `dataloader_persistent_workers`: False
- `skip_memory_metrics`: True
- `use_legacy_prediction_loop`: False
- `push_to_hub`: False
- `resume_from_checkpoint`: None
- `hub_model_id`: None
- `hub_strategy`: every_save
- `hub_private_repo`: None
- `hub_always_push`: False
- `gradient_checkpointing`: False
- `gradient_checkpointing_kwargs`: None
- `include_inputs_for_metrics`: False
- `include_for_metrics`: []
- `eval_do_concat_batches`: True
- `fp16_backend`: auto
- `push_to_hub_model_id`: None
- `push_to_hub_organization`: None
- `mp_parameters`: 
- `auto_find_batch_size`: False
- `full_determinism`: False
- `torchdynamo`: None
- `ray_scope`: last
- `ddp_timeout`: 1800
- `torch_compile`: False
- `torch_compile_backend`: None
- `torch_compile_mode`: None
- `dispatch_batches`: None
- `split_batches`: None
- `include_tokens_per_second`: False
- `include_num_input_tokens_seen`: False
- `neftune_noise_alpha`: None
- `optim_target_modules`: None
- `batch_eval_metrics`: False
- `eval_on_start`: False
- `use_liger_kernel`: False
- `eval_use_gather_object`: False
- `average_tokens_across_devices`: False
- `prompts`: None
- `batch_sampler`: batch_sampler
- `multi_dataset_batch_sampler`: round_robin

</details>

### Framework Versions
- Python: 3.12.3
- Sentence Transformers: 4.0.1
- Transformers: 4.50.3
- PyTorch: 2.6.0+cu124
- Accelerate: 1.5.2
- Datasets: 3.5.0
- Tokenizers: 0.21.1

## Citation

### BibTeX

#### Sentence Transformers
```bibtex
@inproceedings{reimers-2019-sentence-bert,
    title = "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
    author = "Reimers, Nils and Gurevych, Iryna",
    booktitle = "Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing",
    month = "11",
    year = "2019",
    publisher = "Association for Computational Linguistics",
    url = "https://arxiv.org/abs/1908.10084",
}
```

<!--
## Glossary

*Clearly define terms in order to be accessible across audiences.*
-->

<!--
## Model Card Authors

*Lists the people who create the model card, providing recognition and accountability for the detailed work that goes into its construction.*
-->

<!--
## Model Card Contact

*Provides a way for people who have updates to the Model Card, suggestions, or questions, to contact the Model Card authors.*
-->