import { Link } from 'react-router-dom';
import { Copy } from 'lucide-react';
import Alert from '../../../components/ui/Alert.jsx';
import Skeleton from '../../../components/ui/Skeleton.jsx';

export default function DuplicateWarning({ check, isLoading, url }) {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  if (isLoading) return <Skeleton className="h-12 w-full" />;
  if (!check) return null;
  if (!check.duplicate) return <Alert variant="success">This link is not in the directory yet — good to submit.</Alert>;
  return (
    <Alert variant="warning" title="Possible duplicate">
      <span className="flex flex-wrap items-center gap-2">
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        {check.resource?.id
          ? <><strong>{check.resource.title}</strong> ({check.resource.status}) already uses this link. {check.resource.id ? <Link to={`/app/resources/${check.resource.id}`} className="underline">Open it instead</Link> : null}</>
          : 'A submission with this canonical link already exists. Choose a different URL or wait for review.'}
      </span>
    </Alert>
  );
}
