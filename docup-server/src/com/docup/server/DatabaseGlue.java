/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.docup.server;

import com.docup.model.Doctor;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.TypedQuery;

/**
 *
 * @author elion
 */
public class DatabaseGlue {
    
    private static EntityManagerFactory 
            entity_manager_factory = Persistence.createEntityManagerFactory("docup-serverPU");
    

    public static EntityManagerFactory getEntityManagerFactory()
    {
        return entity_manager_factory;
    }
    
     /**
     * Gets the doctor given his username and possword. Useful for the login.
     * @param username
     * @param password
     * @return Doctor
     */
    public static Doctor findDoctor(String username, String password)
    {
        Doctor result = null;
        EntityManager entity_manager=getEntityManagerFactory().createEntityManager();
        try
        {
            String queryString = "SELECT d FROM Doctor d WHERE (d.username = :username and d.password = :password and d.trash = :trash)";
            TypedQuery<Doctor> query = entity_manager.createQuery(queryString, Doctor.class);
            query.setParameter("username", username);
            query.setParameter("password", password);
            query.setParameter("trash", false);
            
            if(query.getResultList().size() > 0){
                result=query.getSingleResult();
            }
        }
        catch(Exception e)
        {
            System.err.println(e.getMessage());
        }
        finally
        {
            entity_manager.close();
        }
        return result;
    }
    
    /**
     * Gets an object
     * @param table
     * @param id
     * @return Object
     */
    public static Object GetObject(Class table, int id)
    {
        Object result = null;
        EntityManager entity_manager=getEntityManagerFactory().createEntityManager();
        try
        {
            TypedQuery<Object> query = entity_manager.createNamedQuery(table.getSimpleName() + ".findById", table);
            query.setParameter("id", id);
            if(query.getResultList().size() > 0){
                result=query.getSingleResult();
            }
        }
        catch(Exception e)
        {
            System.err.println(e.getMessage());
        }
        finally
        {
            entity_manager.close();
        }
        return result;
    }
       
    /**
     * Inserts a row
     * @param row 
     */
    public static Object InsertRow(Object row)
    {
        EntityManager entity_manager=getEntityManagerFactory().createEntityManager();
        try
        {
            entity_manager.getTransaction().begin();
            entity_manager.persist(row);
            entity_manager.getTransaction().commit();
            return row;
        }
        catch(Exception e)
        {
            System.err.println(e.getMessage());
        }
        finally
        {
            entity_manager.close();
        }
        return null;
    }
    

}
