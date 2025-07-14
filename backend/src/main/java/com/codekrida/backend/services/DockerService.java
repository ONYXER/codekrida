package com.codekrida.backend.services;

import com.codekrida.backend.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.config.RuntimeBeanReference;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DockerService {
private final String IMAGE = "ubuntu-web";
private final String BASE_WORKSPACE = "/user";
//    create docker container
    public String createContainer(String email) throws IOException, InterruptedException {

          final String containerName = getContainerName(email);

         if(!checkExistContainer(containerName)){
//"-w","/home/devuser/workspace",
//             creating container
             ProcessBuilder pb = new ProcessBuilder(
                     "docker", "create",
                     "--name",containerName,
                     IMAGE,"tail","-f","/dev/null"
             );
             pb.redirectErrorStream(true);
           Process process =  pb.start();
           process.waitFor();
           int code =process.exitValue();
             if(code == 0){
                 return containerName;
             }

         }
        return email;
    }


    private boolean checkExistContainer(String containerName) throws IOException{
        Process checkExist = new ProcessBuilder("docker","ps","-a","--format","{{.Names}}").start();
        String allContainer = new String(checkExist.getInputStream().readAllBytes());
        return allContainer.contains(containerName);
    }

    private boolean checkContainerRunning(String containerName) throws IOException{
        Process checkRunning = new ProcessBuilder("docker","ps","--format","{{.Names}}").start();
        String allContainer = new String(checkRunning.getInputStream().readAllBytes());
        return allContainer.contains(containerName);
    }

//    starting container
    public void startContainer(String email) throws IOException, InterruptedException {
        final String containerName = getContainerName(email);
        if(checkExistContainer(containerName)){
            createContainer(email);
        }





            new ProcessBuilder("docker","start",containerName).start().waitFor();
    }

//    stop Container
    public void stopContainer(String email) throws IOException, InterruptedException {
        String containerName = getContainerName(email);

        new ProcessBuilder("docker","stop",containerName).start().waitFor();
    }
    private String getContainerName(String email){
        return email.split("@")[0];
    }

  public Process execTerminal(String email) throws IOException, InterruptedException {
        String containerName = getContainerName(email);
        if(!checkContainerRunning(containerName) && checkExistContainer(containerName)){
            startContainer(email);
        }


         ProcessBuilder pb = new ProcessBuilder("script","-q","/dev/null","-c","docker exec -it "+containerName+" bash")  ;
        pb.environment().put("TERM","xterm-256color");
      pb.redirectErrorStream(true);


        return pb.start();
  }


    public String readFileFromContainer(String containerName,String path) throws IOException ,InterruptedException{
        ProcessBuilder pb = new ProcessBuilder("docker","exec",containerName,"bash","-c","cat "+path);
        Process process = pb.start();
        StringBuilder content = new StringBuilder();
        try(BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) !=  null){
                content.append(line).append("\n");
            }
        }
        int wait = process.waitFor();
        if(wait != 0){
            String error = new String(process.getErrorStream().readAllBytes());
            throw new RuntimeException("error reading file: "+error);
        }
        return content.toString();
    }

    public void writeFileToContainer(String containerName,String path,String content) throws IOException,InterruptedException{

        ProcessBuilder pb = new ProcessBuilder("docker","exec","-i",containerName,"bash","-c","tee "+path+" > /dev/null");
        Process process = pb.start();
        try (OutputStream os = process.getOutputStream()){
            os.write(content.getBytes(StandardCharsets.UTF_8));
            os.flush();
        }
        int exit = process.waitFor();

        if(exit != 0){
            String error = new String(process.getErrorStream().readAllBytes());
            throw new RuntimeException("error writing file : " +  error);
        }

    }

    public  void createFile(String containerName,String path) throws IOException,InterruptedException{


        if(checkExistContainer(containerName) && !checkContainerRunning(containerName)){
            startContainer(containerName);
        }
        ProcessBuilder builder = new ProcessBuilder("docker","exec","-i",containerName,"bash","-c" ,"touch "+path);
        Process process = builder.start();
        int exit = process.waitFor();
        if(exit != 0){
            throw  new RuntimeException("failed to create file");
        }
            }

     public void  deleteFile(String containerName,String path) throws IOException,InterruptedException{
         if(checkExistContainer(containerName) && !checkContainerRunning(containerName)){
             startContainer(containerName);
         }
         int exit  = new ProcessBuilder("docker","exec","-i",containerName,"bash","-c","rm "+path).start().waitFor();

         if(exit != 0){
             throw  new RuntimeException("failed to delete file");
         }

     }
     public  void createFolder(String containerName,String path) throws  IOException,InterruptedException{


        int exit = new ProcessBuilder("docker","exec","-i",containerName,"bash","-c"," mkdir "+path).start().waitFor();
         if(exit != 0){
             throw  new RuntimeException("failed to create folder");
         }
     }
     public void removeFolder(String containerName,String path) throws IOException,InterruptedException{

        int exit = new ProcessBuilder("docker","exec","-i",containerName,"bash","-c","rm -r "+path).start().waitFor();
         if(exit != 0){
             throw  new RuntimeException("failed to delete  folder");
         }
     }
     public void moveORRenameFileOrFolder(String containerName,String oldPath,String newPath) throws Exception {



        if(checkContainerRunning(containerName)){

            int exit = new ProcessBuilder("docker","exec","-i",containerName,"bash","-c","mv "+oldPath+" "+newPath).start().waitFor();
            if(exit != 0){
                throw  new Exception("failed to renameOrRemoveFIleOrFolder  folder");
            }
        }

        }

    public List<Map<String,String>> getDirectoryStructure(String path) {


        try{
            List<Map<String,String>> fileList = new ArrayList<>();
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();

                if(auth == null) return  fileList;
            String containerName = ((User)auth.getPrincipal()).getWorkspaceName();



//        build the docker exec command
            ProcessBuilder builder = new ProcessBuilder("docker","exec","-i",containerName,"bash", "-c","find "+path+" -printf  \"%p|%f|%y\\n\"");
            builder.redirectErrorStream(true);
            Process process = builder.start();


            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))){
                String line;

                while((line = reader.readLine()) !=null){
                    String[] parts = line.split("\\|");
                    if(parts.length == 3){
                        Map<String,String> entry =  new HashMap<>();
                        entry.put("path",parts[0]);
                        entry.put("name",parts[1]);
                        entry.put("type",parts[2].equals("d")?"folder":"file");

                        fileList.add(entry);
                    }
                }


            }
            process.waitFor();
            if(!fileList.isEmpty()){
                fileList.removeFirst();
            }
            return  fileList;
        }catch (Exception e) {
            throw new RuntimeException(e);
        }



    }

}
