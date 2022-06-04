import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Link from '@mui/material/Link';
export default function AssignmentFile({assignment}){
return(
    <div style={{marginLeft:"25%"}}>
    <Card sx={{ maxWidth: 345 }}>
    <CardActionArea>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
        {assignment.heading}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {assignment.description}
       
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
 <Link href={assignment.link} underline="none" target="_blank" rel="noreferrer">
 click here to view
</Link>
   
    </div>  
       
)
}