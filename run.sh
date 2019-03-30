A='Created version 57.'
A='[2K[1G| Creating a new version...[2K[1G/ Creating a new version...[2K[1G- Creating a new version...[2K[1G\ Creating a new version...[2K[1G| Creating a new version...[2K[1G/ Creating a new version...[2K[1G- Creating a new version...[2K[1G\ Creating a new version...[2K[1G| Creating a new version...[2K[1G/ Creating a new version...[2K[1G- Creating a new version...[2K[1G\ Creating a new version...[2K[1G| Creating a new version...[2K[1G/ Creating a new version...[2K[1G- Creating a new version...[2K[1G\ Creating a new version...[2K[1G| Creating a new version...[2K[1G/ Creating a new version...[2K[1G- Creating a new version...[2K[1G\ Creating a new version...[2K[1G| Creating a new version...[2K[1G/ Creating a new version...[2K[1GCreated version 62.'
clasp push
A=`clasp version`
B=`echo $A | cut -d 'd' -f2 | cut -d ' ' -f3 | cut -d '.' -f1` 
echo $B
clasp redeploy AKfycbyHpy7In1NHTbDQLg4jkG4PaijeXjQcXxLyzs0oUnD8GupKI9AGWdljpVdqPxs_Ax8WbA $B "Debug"

