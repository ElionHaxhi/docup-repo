/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.docup.server;

import com.docup.model.Picture;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

/**
 *
 * @author elion
 */
@WebServlet(name = "FU", urlPatterns = {"/FU"})
@MultipartConfig
public class FU extends HttpServlet {
    private static final String UPLOAD_DIRECTORY = "pranveraimages";
    
    public FU()
    {
        super();
    }
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException
    {
        super.doGet(req,resp);
    }
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException
    {
        processRequest(req,resp);
    }
    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        System.out.println("Arrivo richiesta");
        response.setContentType("text/html;charset=UTF-8");

        // Create path components to save the file
        final String destination = request.getParameter("destination");
        final String path = getServletContext().getRealPath("") + File.separator + destination;
//        System.out.println("dath destination: " + path);
        final Part filePart = request.getPart("file");
        Date now = new Date();
        String fileName = now.getTime() + "_" + getFileName(filePart);
        String extension = "";
        if(fileName.length() > 4){
            extension = fileName.substring(fileName.length() - 4);
        }
        if(!extension.startsWith("."))
                fileName += ".jpg";

        OutputStream out = null;
        InputStream filecontent = null;
        final PrintWriter writer = response.getWriter();

        try {
            out = new FileOutputStream(new File(path + File.separator
                    + fileName));
            filecontent = filePart.getInputStream();

            int read = 0;
            final byte[] bytes = new byte[1024];

            while ((read = filecontent.read(bytes)) != -1) {
                out.write(bytes, 0, read);
            }
            Picture pic = new Picture();
            pic.setFilename(fileName);
            pic = (Picture)DatabaseGlue.InsertRow(pic);
            
            writer.println("{\"id\":" + pic.getId() + ",\"filename\":\"" + pic.getFilename() + "\"}");
//            System.out.println("File " + fileName + " being uploaded to " + path);
        } catch (FileNotFoundException fne) {
            writer.println("You either did not specify a file to upload or are "
                    + "trying to upload a file to a protected or nonexistent "
                    + "location.");
            writer.println("<br/> ERROR: " + fne.getMessage());

            System.out.println("Problems during file upload. Error: " + fne.getMessage());
        } finally {
            if (out != null) {
                out.close();
            }
            if (filecontent != null) {
                filecontent.close();
            }
            if (writer != null) {
                writer.close();
            }
        }
    }
    
     private String getFileName(final Part part) {
        for (String content : part.getHeader("content-disposition").split(";")) {
            if (content.trim().startsWith("filename")) {
                return content.substring(content.indexOf('=') + 1).trim().replace("\"", "");
            }
        }
        return null;
    }
}
