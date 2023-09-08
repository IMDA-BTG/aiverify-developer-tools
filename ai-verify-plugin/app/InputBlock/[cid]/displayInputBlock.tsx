'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import DisplayMetaInformation from 'playground/components/displayMetaInformation';
import inputBlockSchema from 'src/schemas/ai-verify.inputBlock.schema.json';
import InputBlock from 'playground/inputBlock';
import { InputDataContext, InputDataContextType } from "ai-verify-shared-library/lib";


export default function DisplayInputBlock ({inputBlock, pluginMeta, code, frontmatter}) {
  const router = useRouter();
  const [ selectedIndex, setSelectedIndex ] = useState<number>(0);
  // const [ data, setData ] = useState({});
  const [inputBlockContext, setInputBlockContext] = useState<InputDataContextType>({
    data: {},
    meta: inputBlock.meta,
    onChangeData: (key, value) => {
      setInputBlockContext(prevState => ({
        ...prevState,
        data: {
          ...prevState.data,
          [key]: value
        }
      }))
    }
  });

  function calculateCSSWidth() {
    if (!inputBlock)
      return;

    if (inputBlock.meta.fullScreen) {
      return '100vw';
    }
    
    switch (inputBlock.meta.width) {
      case 'xs':
        return '300px';
      case 'sm':
        return '500px';
      case 'md':
        return '700px';
      case 'lg':
        return '1200px';
      case 'xl':
        return '1400px';
      default:
        return '700px'; // default is md
    }
  }
  
  return (
    <InputDataContext.Provider value={inputBlockContext}>
      <div style={{ display:'block', width:'100%', height:'calc(100vh - 20px)' }}>
        <div style={{ display:'inline-block', width:'calc(100% - 340px)', verticalAlign:'top' }}>
            <button className='aiv-button c-secondary' onClick={() => {router.refresh()}}>Refresh</button>
            <div style={{ height:'calc(100vh - 60px)', marginTop:'5px', overflow:'auto' }}>
              <div className="aiv-panel" style={{ width:calculateCSSWidth() }}>{inputBlock.meta.name} Dialog</div>
              <div style={{ width:calculateCSSWidth(), padding:'5px', border:'1px solid grey' }}>
                <InputBlock inputBlock={inputBlock} code={code} frontmatter={frontmatter} />
              </div>
            </div>
        </div>
        <div style={{ display:'inline-block', height:'calc(100vh - 60px)', width: '340px', padding:'5px' }}>
          <div style={{ display:'flex' }}>
            <button className="aiv-button c-secondary"
              style={{ backgroundColor:(selectedIndex==0)?"#4b255a":undefined }}
              onClick={() => setSelectedIndex(0)}
            >Input Block Meta</button>
            <button className="aiv-button c-secondary"
              style={{ backgroundColor:(selectedIndex==1)?"#4b255a":undefined }}
              onClick={() => setSelectedIndex(1)}
            >Data Output</button>
          </div>
          {selectedIndex==0 && <DisplayMetaInformation component={inputBlock} schema={inputBlockSchema} />}
          {selectedIndex==1 && <pre style={{ padding:'10px', margin:'10px', height:'calc(100% - 20px)', overflowY:'auto' }}>{JSON.stringify(inputBlockContext.data, null, 2)}</pre>}
        </div>
      </div>
    </InputDataContext.Provider>
  )
}