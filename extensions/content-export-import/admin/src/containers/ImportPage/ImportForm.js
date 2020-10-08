import React, {useState, useEffect} from 'react';
import {Button, InputSelect} from "strapi-helper-plugin";
import {convertModelToOption} from "../../utils/convertOptions";
import {find, get, map} from 'lodash';
import {FieldRow, FileField, FormAction} from "./ui-components";
import {readLocalFile} from "../../utils/file";
import JsonDataDisplay from "../../components/JsonDataDisplay";
import {importData} from "../../utils/api";
import Axios from 'axios';

const ImportForm = ({models}) => {
  const options = map(models, convertModelToOption);
  const [loading, setLoading] = useState(false);
  const [targetModelUid, setTargetModel] = useState(undefined);
  const [sourceFile, setSourceFile] = useState(null);
  const [source, setSource] = useState(null);

  useEffect(() => {
    if (!targetModelUid && models && models.length > 0) {
      setTargetModel(models[0].uid);
    }
  }, [models]);

  const onTargetModelChange = (event) => {
    setTargetModel(event.target.value);
  };

  const onSourceFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSource(null);
      setSourceFile(event.target.files[0])
    }
  };

  const onSourceURLChange = (event) => {
    if (event.target.value && event.target.value.length > 3) {
      setSource(null);
      setSourceFile(event.target.value);
    }
  }

  const upload = () => {
    if (!sourceFile) {
      strapi.notification.error("Please choose a source file first.");
      return;
    }
    setLoading(true);
    let prom;
    if(typeof sourceFile == "string") {
      prom = Axios({
        method: "GET",
        url: sourceFile
      }).then((d) => {console.log('DATA', d.data);return d.data;})
    } else {
      prom = readLocalFile(sourceFile, JSON.parse);
    }
    prom.then(setSource)
    .catch((error) => {
      strapi.notification.error(
        "Something wrong when uploading the file, please check the file and try again.");
      console.error(error)
    }).finally(() => {
      setLoading(false);
    })
  };

  const submit = () => {
    if (!targetModelUid) {
      strapi.notification.error("Please select a target content type!");
      return;
    }
    if (!source) {
      strapi.notification.error("Please choose a source file first.");
      return;
    }
    const model = find(models, (model) => model.uid === targetModelUid);
    setLoading(true);
    importData({
      targetModel: model.uid,
      source,
      kind: get(model, 'schema.kind'),
    }).then(() => {
      strapi.notification.success("Import succeeded!");
    }).catch((error) => {
      console.log(error);
      strapi.notification.error("Failed: " + error.message);
    }).finally(() => {
      setLoading(false);
    });
  };
  return (<div>
    <FieldRow>
      <label htmlFor="source">Content Source URL</label>
      <FormAction>
        <input id="source"
               name="source"
               type="input"
               onChange={onSourceURLChange}
        />
      </FormAction>
    </FieldRow>
    <FieldRow>
      <label htmlFor="source">Content Source File</label>
      <FileField>
        <input id="source"
               name="source"
               accept={".json"}
               type="file"
               onChange={onSourceFileChange}
        />
      </FileField>
    </FieldRow>
    {source
      ? (<JsonDataDisplay data={source}/>)
      : (<FormAction>
        <Button disabled={loading}
                onClick={upload}
                secondaryHotline>{loading ? "Please Wait..."
          : "Upload"}</Button>
      </FormAction>)
    }
    <FieldRow>
      <label htmlFor="target-content-type">Target Content Type</label>
      <InputSelect name="targetContentType"
                   id="target-content-type"
                   selectOptions={options}
                   value={targetModelUid}
                   onChange={onTargetModelChange}/>
    </FieldRow>
    <FormAction>
      <Button disabled={loading || targetModelUid === undefined}
              onClick={submit}
              primary>{loading ? "Please Wait..." : "Import"}</Button>
    </FormAction>
  </div>)
};

export default ImportForm;