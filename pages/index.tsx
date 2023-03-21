import 'bootstrap/dist/css/bootstrap.css';
import { Button, Card, Container, Form, Spinner, ProgressBar } from 'react-bootstrap';
import { useRef, useState } from 'react';
import axios from 'axios';
const qs = require('qs')

const Index = () => {
  const [url, setURL] = useState('');
  const [detailData, setDetailData] = useState<DetailData>()
  const [videoData, setVideoData] = useState<VideoData>()
  const [isLoading, setLoading] = useState<KeyValue>({})
  const [urlDownload, setUrlDownload] = useState<KeyValue>({})
  const [progress, setProgress] = useState(0)

  const handleGetDetail = async (event: any) => {
    event.preventDefault();

    setUrlDownload({})

    setLoading({ ...isLoading, ['main']: true })
    try {
      const response = await axios.post("/api/getDetail", { url: url })
      const parsed: DetailData = response.data.data
      setDetailData(parsed)
      setLoading({ ...isLoading, ['main']: false })
    } catch (error) {
      setLoading({ ...isLoading, ['main']: false })
    }
  }

  const CardItem = (data: DetailData) => {
    const getUrlDownload = async () => {
      setLoading({ ...isLoading, ['child']: true })

      try {
        const response = await axios.post("/api/getDownloadUrl", {
          token: data.token,
          pass_md5: data.pass_md5_url
        })
        setLoading({ ...isLoading, ['child']: false })
        setVideoData(response.data.data)

      } catch (error) {
        setLoading({ ...isLoading, ['child']: false })
      }
    }

    const downloadVideo = async () => {
      const response = await axios.get(videoData!!.url, {
        responseType: 'blob',
        onDownloadProgress: function (progressEvent) {
          progressEvent.progress && setProgress(Math.round(progressEvent.progress * 100))
        },
      })

      const href = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `${detailData?.title}.mp4`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }

    return <Card key={'child'}>
      <Card.Body>
        <Card.Title>{data.title}</Card.Title>
        <Card.Text>
          {videoData?.size && <>
            {Number(videoData.size) / 1000000} MB
          </>}
        </Card.Text>
        <Button variant="primary" onClick={getUrlDownload} disabled={isLoading['child']}>
          Get Download URL {isLoading['child'] && <Spinner className='ms-2' as="span" animation="border" size="sm" />}
        </Button>

        {videoData?.url &&
          <>
            <Button className='ms-2' variant="success" onClick={downloadVideo} disabled={progress > 0}>
              Download Video
            </Button>

            {progress > 0 && <>
              <div>
                <ProgressBar className='mt-2' now={progress} label={`${progress}%`} />
              </div>
            </>
            }

          </>
        }
      </Card.Body>
    </Card>
  }

  return (
    <Container>
      <div className='text-center mt-2'>
        <h2>Dood Dw</h2>
      </div>

      <Form onSubmit={handleGetDetail}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Enter URL Doodstream</Form.Label>
          <Form.Control type="text" placeholder="URL" onChange={(e) => setURL(e.target.value)} />
          <Form.Text className="text-muted">
            https://dood.yt/e/1abcdefgxxxx.
          </Form.Text>
        </Form.Group>

        <div className='text-center'>
          <Button variant="primary" type="submit" disabled={isLoading['main']} >
            Get Detail {isLoading['main'] && <Spinner className='ms-2' as="span" animation="border" size="sm" />}
          </Button>
        </div>
      </Form>

      <br />

      {detailData && CardItem(detailData)}

    </Container>
  );
}

interface DetailData {
  token: string,
  title: string,
  pass_md5_url: string
}

interface VideoData {
  url: string
  size: number
}

type KeyValue = {
  [key: string]: any;
};

export default Index