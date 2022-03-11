import { Button, Grid, Message } from '@arco-design/web-react';
import { copy } from '@extensions/utils/copy';
import {
  useBlock,
  useFocusIdx,
  useEditorContext,
  useEditorProps,
  Stack,
} from 'easy-email-editor';
import React from 'react';

export function TagsPanel() {
  const onCopyHtml = (text: string) => {
    copy(text);
    Message.success('Sao chép thành công!');
  };

  return (
    <div style={{ padding: '10px 10px' }}>
      <Grid.Col >
        <Stack vertical>
          <Grid.Row justify='space-between' >
            <div style={{ textAlign: 'center' }}>[[EMAIL]]</div>
            <Button style={{ margin: '10' }} onClick={() => onCopyHtml('[[EMAIL]]')}> Copy</Button>
          </Grid.Row>
          <Grid.Row justify='space-between'>
            <div style={{ textAlign: 'center' }}>[[PHONE]]</div>
            <Button style={{ margin: '10' }} onClick={() => onCopyHtml('[[PHONE]]')}> Copy</Button>
          </Grid.Row>
          <Grid.Row justify='space-between'>
            <div style={{ textAlign: 'center' }}>[[NAME]]</div>
            <Button onClick={() => onCopyHtml('[[NAME]]')}> Copy</Button>
          </Grid.Row>
        </Stack>
      </Grid.Col>
    </div>


  );
}
